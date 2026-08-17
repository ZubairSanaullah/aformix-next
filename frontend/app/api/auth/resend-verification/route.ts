import { NextResponse } from "next/server";
import { resendVerificationSchema } from "@/lib/validations/auth";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { resendVerificationOtp } from "@/lib/services/auth-security";

export async function POST(request: Request) {
    try {
        const ip = getClientIp(request);
        const body = await request.json();
        const result = resendVerificationSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    error: result.error.issues[0].message,
                },
                { status: 400 }
            );
        }

        const { email } = result.data;
        const normalizedEmail = email.trim().toLowerCase();

        // 60-second cooldown per email
        const cooldownLimit = checkRateLimit(`resend-cooldown:${normalizedEmail}`, 1, 60 * 1000);
        if (!cooldownLimit.success) {
            return NextResponse.json(
                {
                    error: `Please wait ${cooldownLimit.retryAfterSeconds} seconds before requesting another verification code.`,
                },
                { status: 429 }
            );
        }

        // Max 5 resends per hour per IP
        const hourlyLimit = checkRateLimit(`resend-hourly:${ip}`, 5, 60 * 60 * 1000);
        if (!hourlyLimit.success) {
            return NextResponse.json(
                {
                    error: "Too many resend requests. Please try again later.",
                },
                { status: 429 }
            );
        }

        const resendResult = await resendVerificationOtp(normalizedEmail);

        return NextResponse.json(
            {
                success: true,
                message: resendResult.message,
                alreadyVerified: resendResult.alreadyVerified,
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("Resend verification error:", error);

        return NextResponse.json(
            {
                error: "Failed to resend verification code. Please try again.",
            },
            { status: 500 }
        );
    }
}
