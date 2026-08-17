import { NextResponse } from "next/server";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { executePasswordReset } from "@/lib/services/auth-security";

export async function POST(request: Request) {
    try {
        const ip = getClientIp(request);
        const rateLimit = checkRateLimit(`reset-password:${ip}`, 10, 15 * 60 * 1000);

        if (!rateLimit.success) {
            return NextResponse.json(
                {
                    error: `Too many password reset attempts. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
                },
                { status: 429 }
            );
        }

        const body = await request.json();
        const result = resetPasswordSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    error: result.error.issues[0].message,
                },
                { status: 400 }
            );
        }

        const { token, password } = result.data;
        const resetResult = await executePasswordReset({
            token,
            newPassword: password,
        });

        if (!resetResult.success) {
            return NextResponse.json(
                {
                    error: resetResult.error || "Failed to reset password.",
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: resetResult.message || "Password has been reset successfully.",
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("Reset password error:", error);

        return NextResponse.json(
            {
                error: "Failed to reset password. Please try again.",
            },
            { status: 500 }
        );
    }
}
