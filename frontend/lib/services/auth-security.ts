import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateOtp, generateSecureToken, hashSecret, timingSafeEqual } from "@/lib/security/tokens";
import {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendPasswordChangedEmail,
} from "@/lib/email";

const OTP_EXPIRY_MINUTES = 10;
const RESET_TOKEN_EXPIRY_HOURS = 1;

/**
 * Generates and stores a new OTP, invalidates previous ones, and dispatches the verification email.
 */
export async function createAndSendVerificationOtp(user: {
    id: string;
    email: string;
    name?: string | null;
}): Promise<{ success: boolean; error?: string }> {
    try {
        // Invalidate previous unused OTPs for this user
        await prisma.emailVerificationOtp.updateMany({
            where: {
                userId: user.id,
                usedAt: null,
            },
            data: {
                usedAt: new Date(),
            },
        });

        const otp = generateOtp(6);
        const otpHash = hashSecret(otp);
        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

        await prisma.emailVerificationOtp.create({
            data: {
                userId: user.id,
                email: user.email,
                otpHash,
                expiresAt,
                purpose: "EMAIL_VERIFICATION",
            },
        });

        // Dispatch verification email safely
        await sendVerificationEmail({
            to: user.email,
            name: user.name,
            otp,
        });

        return { success: true };
    } catch (error: unknown) {
        const errMessage = error instanceof Error ? error.message : "Failed to create verification code.";
        console.error("[AUTH_SECURITY_CREATE_OTP]", errMessage);
        return { success: false, error: errMessage };
    }
}

/**
 * Verifies a 6-digit OTP code against the latest active record.
 */
export async function verifyUserEmailOtp(params: {
    email: string;
    otp: string;
}): Promise<{ success: boolean; error?: string; message?: string; alreadyVerified?: boolean }> {
    const normalizedEmail = params.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
    });

    if (!user) {
        return {
            success: false,
            error: "Invalid email or verification code.",
        };
    }

    if (user.emailVerified) {
        return {
            success: true,
            message: "Your email is already verified.",
            alreadyVerified: true,
        };
    }

    const latestOtp = await prisma.emailVerificationOtp.findFirst({
        where: {
            userId: user.id,
            usedAt: null,
            purpose: "EMAIL_VERIFICATION",
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    if (!latestOtp) {
        return {
            success: false,
            error: "No active verification code found. Please request a new code.",
        };
    }

    const now = new Date();
    if (latestOtp.expiresAt < now) {
        await prisma.emailVerificationOtp.update({
            where: { id: latestOtp.id },
            data: { usedAt: now },
        });
        return {
            success: false,
            error: "Verification code has expired. Please request a new code.",
        };
    }

    if (latestOtp.attempts >= latestOtp.maxAttempts) {
        await prisma.emailVerificationOtp.update({
            where: { id: latestOtp.id },
            data: { usedAt: now },
        });
        return {
            success: false,
            error: "Too many failed attempts. Please request a new verification code.",
        };
    }

    const providedHash = hashSecret(params.otp.trim());
    const isMatch = timingSafeEqual(latestOtp.otpHash, providedHash);

    if (!isMatch) {
        await prisma.emailVerificationOtp.update({
            where: { id: latestOtp.id },
            data: {
                attempts: {
                    increment: 1,
                },
            },
        });
        return {
            success: false,
            error: "Invalid verification code. Please check and try again.",
        };
    }

    // Mark OTP as consumed and verify user
    await prisma.$transaction([
        prisma.emailVerificationOtp.update({
            where: { id: latestOtp.id },
            data: { usedAt: now },
        }),
        prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: now },
        }),
    ]);

    // Send Welcome Email
    await sendWelcomeEmail({
        to: user.email,
        name: user.name,
    });

    return {
        success: true,
        message: "Email verified successfully.",
    };
}

/**
 * Resends a verification OTP to the user.
 */
export async function resendVerificationOtp(
    email: string
): Promise<{ success: boolean; message: string; alreadyVerified?: boolean }> {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
    });

    if (!user) {
        // Return generic success to prevent account enumeration
        return {
            success: true,
            message: "If an account exists with this email, a new verification code has been sent.",
        };
    }

    if (user.emailVerified) {
        return {
            success: true,
            message: "This account is already verified.",
            alreadyVerified: true,
        };
    }

    await createAndSendVerificationOtp(user);

    return {
        success: true,
        message: "A new verification code has been sent to your email address.",
    };
}

/**
 * Initiates a password reset request without leaking account existence.
 */
export async function requestPasswordReset(
    email: string
): Promise<{ success: boolean; message: string }> {
    const genericResponse = {
        success: true,
        message: "If an account exists for this email address, you will receive password reset instructions.",
    };

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
    });

    if (!user) {
        return genericResponse;
    }

    // Invalidate previous unused reset tokens for this user
    await prisma.passwordResetToken.updateMany({
        where: {
            userId: user.id,
            usedAt: null,
        },
        data: {
            usedAt: new Date(),
        },
    });

    const rawToken = generateSecureToken(32);
    const tokenHash = hashSecret(rawToken);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
        data: {
            userId: user.id,
            email: user.email,
            tokenHash,
            expiresAt,
        },
    });

    const appUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;

    await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl,
    });

    return genericResponse;
}

/**
 * Resets the user's password given a valid reset token.
 */
export async function executePasswordReset(params: {
    token: string;
    newPassword: string;
}): Promise<{ success: boolean; error?: string; message?: string }> {
    const tokenHash = hashSecret(params.token.trim());

    const tokenRecord = await prisma.passwordResetToken.findUnique({
        where: { tokenHash },
        include: { user: true },
    });

    if (!tokenRecord || tokenRecord.usedAt !== null) {
        return {
            success: false,
            error: "Invalid or expired password reset link. Please request a new one.",
        };
    }

    const now = new Date();
    if (tokenRecord.expiresAt < now) {
        await prisma.passwordResetToken.update({
            where: { id: tokenRecord.id },
            data: { usedAt: now },
        });
        return {
            success: false,
            error: "This password reset link has expired. Please request a new one.",
        };
    }

    if (tokenRecord.attempts >= tokenRecord.maxAttempts) {
        await prisma.passwordResetToken.update({
            where: { id: tokenRecord.id },
            data: { usedAt: now },
        });
        return {
            success: false,
            error: "Too many attempts on this link. Please request a new password reset.",
        };
    }

    const hashedPassword = await bcrypt.hash(params.newPassword, 12);

    await prisma.$transaction([
        prisma.user.update({
            where: { id: tokenRecord.userId },
            data: { password: hashedPassword },
        }),
        prisma.passwordResetToken.update({
            where: { id: tokenRecord.id },
            data: { usedAt: now },
        }),
        prisma.passwordResetToken.updateMany({
            where: {
                userId: tokenRecord.userId,
                usedAt: null,
            },
            data: {
                usedAt: now,
            },
        }),
    ]);

    // Send security notification email
    await sendPasswordChangedEmail({
        to: tokenRecord.user.email,
        name: tokenRecord.user.name,
        timestamp: now,
    });

    return {
        success: true,
        message: "Your password has been reset successfully. You can now sign in with your new password.",
    };
}
