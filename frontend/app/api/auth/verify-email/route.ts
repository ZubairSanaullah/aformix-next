import { NextResponse } from "next/server";
import { verifyOtpSchema } from "@/lib/validations/auth";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { verifyUserEmailOtp } from "@/lib/services/auth-security";

export async function POST(request: Request) {
    try {
        const ip = getClientIp(request);
        const rateLimit = checkRateLimit(`verify-otp:${ip}`, 10, 15 * 60 * 1000);

        if (!rateLimit.success) {
            return NextResponse.json(
                {
                    error: `Too many verification attempts. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
                },
                { status: 429 }
            );
        }

        const body = await request.json();
        const result = verifyOtpSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    error: result.error.issues[0].message,
                },
                { status: 400 }
            );
        }

        const { email, otp } = result.data;
        const verificationResult = await verifyUserEmailOtp({ email, otp });

        if (!verificationResult.success) {
            return NextResponse.json(
                {
                    error: verificationResult.error || "Verification failed.",
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: verificationResult.message || "Email verified successfully.",
                alreadyVerified: verificationResult.alreadyVerified,
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("Email verification error:", error);

        return NextResponse.json(
            {
                error: "An unexpected error occurred during email verification. Please try again.",
            },
            { status: 500 }
        );
    }
}
