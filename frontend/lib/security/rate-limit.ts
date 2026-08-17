interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Periodic cleanup of expired rate limit entries every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredEntries() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

    lastCleanup = now;
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetTime <= now) {
            rateLimitStore.delete(key);
        }
    }
}

export interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    resetTime: number;
    retryAfterSeconds: number;
}

export function checkRateLimit(
    key: string,
    limit: number,
    windowMs: number
): RateLimitResult {
    cleanupExpiredEntries();

    const now = Date.now();
    const existing = rateLimitStore.get(key);

    if (!existing || existing.resetTime <= now) {
        const resetTime = now + windowMs;
        rateLimitStore.set(key, { count: 1, resetTime });
        return {
            success: true,
            limit,
            remaining: limit - 1,
            resetTime,
            retryAfterSeconds: 0,
        };
    }

    if (existing.count >= limit) {
        const retryAfterSeconds = Math.max(
            1,
            Math.ceil((existing.resetTime - now) / 1000)
        );
        return {
            success: false,
            limit,
            remaining: 0,
            resetTime: existing.resetTime,
            retryAfterSeconds,
        };
    }

    existing.count += 1;
    return {
        success: true,
        limit,
        remaining: limit - existing.count,
        resetTime: existing.resetTime,
        retryAfterSeconds: 0,
    };
}

export function getClientIp(request: Request): string {
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }
    const realIp = request.headers.get("x-real-ip");
    if (realIp) {
        return realIp.trim();
    }
    return "127.0.0.1";
}
