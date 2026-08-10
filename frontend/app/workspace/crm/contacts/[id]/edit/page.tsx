import { notFound, redirect } from "next/navigation";

import {
    WorkspaceBreadcrumbs,
    WorkspacePageHeader,
} from "@/components/workspace/ui";

import { EditContactForm } from "@/components/workspace/crm/contacts";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getCRMCompaniesForFilter } from "@/lib/services/crm";

interface EditContactPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditContactPage({
    params,
}: EditContactPageProps) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const { id } = await params;

    const [contact, companies] = await Promise.all([
        prisma.contact.findFirst({
            where: {
                id,
                deletedAt: null,
                ownerId: session.user.id,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                jobTitle: true,
                website: true,
                linkedinUrl: true,
                description: true,
                companyId: true,
                source: true,
                status: true,
            },
        }),

        getCRMCompaniesForFilter(),
    ]);

    if (!contact) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <WorkspaceBreadcrumbs
                items={[
                    {
                        label: "CRM",
                        href: "/workspace/crm",
                    },
                    {
                        label: "Contacts",
                        href: "/workspace/crm/contacts",
                    },
                    {
                        label: `${contact.firstName}${contact.lastName
                                ? ` ${contact.lastName}`
                                : ""
                            }`,
                        href: `/workspace/crm/contacts/${contact.id}`,
                    },
                    {
                        label: "Edit",
                    },
                ]}
            />

            <WorkspacePageHeader
                title="Edit Contact"
                description="Update contact information and CRM details."
            />

            <EditContactForm
                contact={contact}
                companies={companies}
            />
        </div>
    );
}