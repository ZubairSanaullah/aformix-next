import { describe, it, expect } from "vitest";
import { generateOtp, generateSecureToken, hashSecret, timingSafeEqual } from "../security/tokens";
import { checkRateLimit } from "../security/rate-limit";
import {
    registerSchema,
    verifyOtpSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
} from "../validations/auth";
import { generateVerificationEmail } from "../email/templates/verification";
import { generateWelcomeEmail } from "../email/templates/welcome";
import { generatePasswordResetEmail } from "../email/templates/password-reset";
import { generatePasswordChangedEmail } from "../email/templates/password-changed";

describe("Security Tokens & OTP Utilities", () => {
    it("should generate a 6-digit numeric OTP", () => {
        const otp = generateOtp(6);
        expect(otp).toHaveLength(6);
        expect(/^\d{6}$/.test(otp)).toBe(true);
    });

    it("should generate cryptographically secure random tokens", () => {
        const token1 = generateSecureToken(32);
        const token2 = generateSecureToken(32);
        expect(token1).toHaveLength(64);
        expect(token2).toHaveLength(64);
        expect(token1).not.toEqual(token2);
    });

    it("should hash secrets consistently and safely with salt", () => {
        const raw = "123456";
        const hash1 = hashSecret(raw);
        const hash2 = hashSecret(raw);
        expect(hash1).toHaveLength(64);
        expect(hash1).toEqual(hash2);
        expect(hash1).not.toEqual(raw);
    });

    it("should perform timing-safe constant time comparisons", () => {
        const secret = "secret-token-value-123";
        const hashedA = hashSecret(secret);
        const hashedB = hashSecret(secret);
        const hashedWrong = hashSecret("wrong-token-value");

        expect(timingSafeEqual(hashedA, hashedB)).toBe(true);
        expect(timingSafeEqual(hashedA, hashedWrong)).toBe(false);
    });
});

describe("In-Memory Sliding Window Rate Limiter", () => {
    it("should allow requests within the limit", () => {
        const key = `test-limit-${Date.now()}`;
        const res1 = checkRateLimit(key, 3, 1000);
        const res2 = checkRateLimit(key, 3, 1000);
        const res3 = checkRateLimit(key, 3, 1000);

        expect(res1.success).toBe(true);
        expect(res1.remaining).toBe(2);
        expect(res2.success).toBe(true);
        expect(res2.remaining).toBe(1);
        expect(res3.success).toBe(true);
        expect(res3.remaining).toBe(0);

        // 4th request exceeds limit
        const res4 = checkRateLimit(key, 3, 1000);
        expect(res4.success).toBe(false);
        expect(res4.remaining).toBe(0);
        expect(res4.retryAfterSeconds).toBeGreaterThanOrEqual(1);
    });
});

describe("Auth Validation Schemas", () => {
    it("validates register schema with matching passwords", () => {
        const valid = registerSchema.safeParse({
            name: "Alex Smith",
            email: "alex@example.com",
            password: "password123",
            confirmPassword: "password123",
        });
        expect(valid.success).toBe(true);
        if (valid.success) {
            expect(valid.data.email).toBe("alex@example.com");
        }
    });

    it("rejects mismatched passwords in register schema", () => {
        const invalid = registerSchema.safeParse({
            name: "Alex Smith",
            email: "alex@example.com",
            password: "password123",
            confirmPassword: "different-password",
        });
        expect(invalid.success).toBe(false);
    });

    it("validates 6-digit OTP schema", () => {
        const valid = verifyOtpSchema.safeParse({
            email: "user@example.com",
            otp: "123456",
        });
        expect(valid.success).toBe(true);

        const invalid = verifyOtpSchema.safeParse({
            email: "user@example.com",
            otp: "12ab",
        });
        expect(invalid.success).toBe(false);
    });

    it("validates forgot password schema", () => {
        const valid = forgotPasswordSchema.safeParse({
            email: "user@example.com",
        });
        expect(valid.success).toBe(true);
    });

    it("validates reset password schema with matching passwords", () => {
        const valid = resetPasswordSchema.safeParse({
            token: "valid-token-string",
            password: "newStrongPassword123",
            confirmPassword: "newStrongPassword123",
        });
        expect(valid.success).toBe(true);
    });

    it("validates change password schema", () => {
        const valid = changePasswordSchema.safeParse({
            currentPassword: "oldPassword123",
            newPassword: "newPassword456",
            confirmPassword: "newPassword456",
        });
        expect(valid.success).toBe(true);

        const samePassword = changePasswordSchema.safeParse({
            currentPassword: "oldPassword123",
            newPassword: "oldPassword123",
            confirmPassword: "oldPassword123",
        });
        expect(samePassword.success).toBe(false);
    });
});

describe("Transactional Email Templates", () => {
    it("generates verification email with branded layout, OTP code, and text fallback", () => {
        const { subject, html, text } = generateVerificationEmail({
            name: "Sarah",
            otp: "789123",
        });
        expect(subject).toBe("Verify your Aformix account");
        expect(html).toContain("789123");
        expect(html).toContain("Aformix");
        expect(html).toContain("10 minutes");
        expect(text).toContain("789123");
    });

    it("generates welcome email with workspace features and CTA", () => {
        const { subject, html, text } = generateWelcomeEmail({
            name: "Sarah",
        });
        expect(subject).toContain("Welcome to Aformix");
        expect(html).toContain("Sarah");
        expect(html).toContain("workspace");
        expect(text).toContain("Articles");
    });

    it("generates password reset email with secure URL and expiry warning", () => {
        const resetUrl = "https://aformix.com/reset-password?token=sample123";
        const { subject, html, text } = generatePasswordResetEmail({
            name: "Sarah",
            resetUrl,
        });
        expect(subject).toContain("Reset your Aformix password");
        expect(html).toContain(resetUrl);
        expect(html).toContain("1 hour");
        expect(text).toContain(resetUrl);
    });

    it("generates password changed security alert email", () => {
        const timestamp = new Date("2026-08-17T12:00:00Z");
        const { subject, html, text } = generatePasswordChangedEmail({
            name: "Sarah",
            timestamp,
        });
        expect(subject).toContain("Security Alert");
        expect(html).toContain("Password Changed Successfully");
        expect(text).toContain("password was changed");
    });
});
