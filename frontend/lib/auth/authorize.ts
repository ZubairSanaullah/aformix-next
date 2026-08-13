import { NextResponse } from "next/server";

interface AuthorizableSession {
    user?: {
        id?: string | null;
        role?: string | null;
    } | null;
}

/**
 * Returns a 403 NextResponse if the session user is neither the
 * record's owner nor an ADMIN. Returns null if authorized (caller
 * should continue).
 *
 * Use for records with an owner/user field: Deal.ownerId,
 * Activity.userId, Note.userId, Lead.ownerId, Contact.ownerId,
 * Company.ownerId.
 */
export function requireOwnerOrAdmin(
    session: AuthorizableSession,
    resourceOwnerId: string
): NextResponse | null {
    const userId = session.user?.id;
    const role = session.user?.role;

    if (!userId) {
        return NextResponse.json(
            {
                error: "Unauthorized",
            },
            {
                status: 401,
            }
        );
    }

    if (userId === resourceOwnerId || role === "ADMIN") {
        return null;
    }

    return NextResponse.json(
        {
            error: "You don't have permission to modify this record.",
        },
        {
            status: 403,
        }
    );
}

export function requireAdmin(
    session: AuthorizableSession
): NextResponse | null {
    const userId = session.user?.id;
    const role = session.user?.role;

    if (!userId) {
        return NextResponse.json(
            {
                error: "Unauthorized",
            },
            {
                status: 401,
            }
        );
    }

    if (role !== "ADMIN") {
        return NextResponse.json(
            {
                error: "Administrator access required.",
            },
            {
                status: 403,
            }
        );
    }

    return null;
}