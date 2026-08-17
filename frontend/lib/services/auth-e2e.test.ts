import { describe, it, expect, beforeAll, afterAll } from "vitest";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma";
import {
    createAndSendVerificationOtp,
    verifyUserEmailOtp,
    resendVerificationOtp,
    requestPasswordReset,
    executePasswordReset,
} from "./auth-security";

describe("End-to-End Auth & Security Service Integration", () => {
    const testEmail = `test-user-${Date.now()}@aformix-test.local`;
    let testUserId: string;

    beforeAll(async () => {
        const hashedPassword = await bcrypt.hash("InitialPassword123!", 10);
        const user = await prisma.user.create({
            data: {
                name: "Integration Test User",
                email: testEmail,
                password: hashedPassword,
                emailVerified: null,
            },
        });
        testUserId = user.id;
    });

    afterAll(async () => {
        // Clean up test records
        await prisma.emailVerificationOtp.deleteMany({ where: { userId: testUserId } });
        await prisma.passwordResetToken.deleteMany({ where: { userId: testUserId } });
        await prisma.user.delete({ where: { id: testUserId } });
    });

    it("1. Generates and stores verification OTP in database", async () => {
        const sendResult = await createAndSendVerificationOtp({
            id: testUserId,
            email: testEmail,
            name: "Integration Test User",
        });
        expect(sendResult.success).toBe(true);

        const otpRecord = await prisma.emailVerificationOtp.findFirst({
            where: { userId: testUserId, usedAt: null },
        });

        expect(otpRecord).not.toBeNull();
        expect(otpRecord?.email).toBe(testEmail);
        expect(otpRecord?.otpHash).toBeDefined();
        expect(otpRecord?.attempts).toBe(0);
    });

    it("2. Fails verification on incorrect OTP and increments attempt counter", async () => {
        const failResult = await verifyUserEmailOtp({
            email: testEmail,
            otp: "000000",
        });
        expect(failResult.success).toBe(false);

        const otpRecord = await prisma.emailVerificationOtp.findFirst({
            where: { userId: testUserId, usedAt: null },
        });
        expect(otpRecord?.attempts).toBe(1);
    });

    it("3. Resends a new OTP and invalidates previous active OTPs", async () => {
        const resendResult = await resendVerificationOtp(testEmail);
        expect(resendResult.success).toBe(true);

        const activeOtps = await prisma.emailVerificationOtp.findMany({
            where: { userId: testUserId, usedAt: null },
        });
        // Exactly one active OTP should remain
        expect(activeOtps).toHaveLength(1);
    });

    it("4. Initiates password reset without leaking account existence", async () => {
        const resetReq = await requestPasswordReset(testEmail);
        expect(resetReq.success).toBe(true);
        expect(resetReq.message).toContain("If an account exists");

        const tokenRecord = await prisma.passwordResetToken.findFirst({
            where: { userId: testUserId, usedAt: null },
        });
        expect(tokenRecord).not.toBeNull();
        expect(tokenRecord?.email).toBe(testEmail);
    });

    it("5. Rejects password reset with invalid token", async () => {
        const resetRes = await executePasswordReset({
            token: "invalid-token-xyz",
            newPassword: "BrandNewPassword123!",
        });
        expect(resetRes.success).toBe(false);
    });
});
