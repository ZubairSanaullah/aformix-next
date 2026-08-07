import crypto from "crypto";

export function generateHash(
    buffer: Buffer
) {
    return crypto
        .createHash("sha256")
        .update(buffer)
        .digest("hex");
}