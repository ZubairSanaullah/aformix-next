import crypto from "crypto";

const AUTH_SECRET = process.env.AUTH_SECRET || "aformix-production-auth-salt-fallback";

/**
 * Generates a cryptographically secure numeric OTP of the specified length (default 6 digits).
 */
export function generateOtp(length = 6): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length);
    const code = crypto.randomInt(min, max);
    return code.toString();
}

/**
 * Generates a cryptographically secure random token string.
 */
export function generateSecureToken(bytes = 32): string {
    return crypto.randomBytes(bytes).toString("hex");
}

/**
 * Hashes a token or OTP with SHA-256 and server-side salt for secure at-rest storage.
 */
export function hashSecret(value: string): string {
    return crypto
        .createHash("sha256")
        .update(`${value}:${AUTH_SECRET}`)
        .digest("hex");
}

/**
 * Performs a constant-time comparison of two string hashes to protect against timing attacks.
 */
export function timingSafeEqual(known: string, provided: string): boolean {
    const knownBuffer = Buffer.from(known, "utf-8");
    const providedBuffer = Buffer.from(provided, "utf-8");

    if (knownBuffer.length !== providedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(knownBuffer, providedBuffer);
}
