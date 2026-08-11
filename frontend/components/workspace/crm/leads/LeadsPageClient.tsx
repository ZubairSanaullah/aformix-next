"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import {
    WorkspaceButton,
    WorkspacePageActions,
} from "@/components/workspace/ui";

import LeadFilters from "@/components/workspace/crm/leads/LeadFilters";
import LeadTable from "@/components/workspace/crm/leads/LeadTable";
import LeadForm from "@/components/workspace/crm/leads/LeadForm";

interface LeadFilterCompany {
    id: string;
    name: string;
}

interface LeadFilterContact {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
}

interface LeadsPageClientProps {
    leads: any[];
    companies: LeadFilterCompany[];
    contacts: LeadFilterContact[];
}

export default function LeadsPageClient({
    leads,
    companies,
    contacts,
}: LeadsPageClientProps) {
    const [isAdding, setIsAdding] =
        useState(false);

    return (
        <>
            <div className="flex items-center justify-end">
                <WorkspacePageActions>
                    <WorkspaceButton
                        type="button"
                        onClick={() =>
                            setIsAdding(true)
                        }
                        disabled={isAdding}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Lead
                    </WorkspaceButton>
                </WorkspacePageActions>
            </div>

            {isAdding && (
                <LeadForm
                    companies={companies}
                    contacts={contacts}
                    onCancel={() =>
                        setIsAdding(false)
                    }
                />
            )}

            {!isAdding && (
                <>
                    <LeadFilters
                        companies={companies}
                        contacts={contacts}
                    />

                    <LeadTable
                        leads={leads}
                    />
                </>
            )}
        </>
    );
}