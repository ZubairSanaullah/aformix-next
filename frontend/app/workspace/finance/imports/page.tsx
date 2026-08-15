import Link from "next/link";
import { Plus } from "lucide-react";

import {
    WorkspaceAlert,
    WorkspacePageHeader,
} from "@/components/workspace/ui";

import FinanceImportsPageClient from "@/components/workspace/finance/FinanceImportsPageClient";

import {
    isAuthorizationError,
    requireAdmin,
} from "@/lib/auth/authorization";

import { prisma } from "@/lib/prisma";

interface ImportsPageProps {
    searchParams: Promise<{
        page?: string;
    }>;
}

export default async function ImportsPage({
    searchParams,
}: ImportsPageProps) {
    let currentUser;

    try {
        currentUser = await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            return (
                <div className="space-y-6">
                    <WorkspacePageHeader
                        title="Imports"
                        description="View import history and upload new files."
                    />

                    <WorkspaceAlert variant="danger" title="Access restricted">
                        {error.status === 401
                            ? "Please sign in to view Imports."
                            : "Only administrators can access the Finance module."}
                    </WorkspaceAlert>
                </div>
            );
        }

        throw error;
    }

    const params = await searchParams;
    const page = Number(params.page) > 0 ? Number(params.page) : 1;
    const limit = 20;

    const [imports, total] = await Promise.all([
        prisma.financeImport.findMany({
            include: {
                createdBy: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.financeImport.count(),
    ]);

    const pagination = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-medium text-[var(--workspace-primary)]">
                        FINANCE
                    </p>

                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--workspace-text)]">
                        Imports
                    </h1>

                    <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--workspace-text-muted)]">
                        Upload and manage financial transaction imports.
                    </p>
                </div>

                <Link
                    href="/workspace/finance/imports/new"
                    className="
              inline-flex
              h-9
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-[var(--workspace-primary)]
              px-3.5
              text-xs
              font-semibold
              text-white
              shadow-sm
              transition-all
              duration-150
              hover:opacity-90
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
              focus:ring-offset-2
              focus:ring-offset-[var(--workspace-background)]
            "
                >
                    <Plus className="h-4 w-4" />
                    New Import
                </Link>
            </div>

            <FinanceImportsPageClient
                imports={imports}
                pagination={pagination}
            />
        </div>
    );
}
