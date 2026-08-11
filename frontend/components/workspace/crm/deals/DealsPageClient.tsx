"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import {
    WorkspaceButton,
    WorkspacePageActions,
} from "@/components/workspace/ui";

import DealFilters from "@/components/workspace/crm/deals/DealFilters";
import DealTable from "@/components/workspace/crm/deals/DealTable";
import DealForm from "@/components/workspace/crm/deals/DealForm";

interface DealFilterCompany {
    id: string;
    name: string;
}

interface DealFilterContact {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
}

interface DealFilterPipeline {
    id: string;
    name: string;
    stages: {
        id: string;
        name: string;
    }[];
}

interface DealFilterLead {
    id: string;
    title: string;
}

interface DealsPageClientProps {
    deals: any[];
    companies: DealFilterCompany[];
    contacts: DealFilterContact[];
    leads: DealFilterLead[];
    pipelines: DealFilterPipeline[];
}

export default function DealsPageClient({
    deals,
    companies,
    contacts,
    leads,
    pipelines,
}: DealsPageClientProps) {
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
                        Add Deal
                    </WorkspaceButton>
                </WorkspacePageActions>
            </div>

            {isAdding && (
                <DealForm
                    companies={companies}
                    contacts={contacts}
                    leads={leads}
                    pipelines={pipelines}
                    onCancel={() =>
                        setIsAdding(false)
                    }
                />
            )}

            {!isAdding && (
                <>
                    <DealFilters
                        companies={companies}
                        contacts={contacts}
                        pipelines={pipelines}
                    />

                    <DealTable
                        deals={deals}
                    />
                </>
            )}
        </>
    );
}