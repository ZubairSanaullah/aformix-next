import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export class AuthorizationError extends Error {
    status: 401 | 403;

    constructor(message: string, status: 401 | 403) {
        super(message);
        this.name = "AuthorizationError";
        this.status = status;
    }
}

export async function requireAdmin() {
    const session = await auth();

    if (!session?.user?.id) {
        throw new AuthorizationError(
            "Authentication required.",
            401
        );
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
        },
    });

    if (!user) {
        throw new AuthorizationError(
            "Authenticated user not found.",
            401
        );
    }

    if (user.role !== "ADMIN") {
        throw new AuthorizationError(
            "Administrator access required.",
            403
        );
    }

    return user;
}

export function isAuthorizationError(
    error: unknown
): error is AuthorizationError {
    return error instanceof AuthorizationError;
}