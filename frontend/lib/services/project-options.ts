import { prisma } from "@/lib/prisma";

/**
 * Minimal user list for the Project "Owner" select in ProjectForm /
 * ProjectFilters. Intentionally separate from lib/services/projects.ts —
 * the Phase 14 handoff says not to rebuild the Projects service layer, and
 * this has nothing to do with Project records themselves.
 *
 * If the codebase already has an equivalent user-listing query (e.g. for
 * Task assignment), prefer that one instead of this file to avoid a
 * duplicate. Not verified against the existing codebase since no such
 * file was provided during handoff.
 */
export async function getProjectOwnerOptions() {
    return prisma.user.findMany({
        orderBy: {
            name: "asc",
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
}
