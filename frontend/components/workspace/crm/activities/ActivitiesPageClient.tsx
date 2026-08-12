"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import {
    WorkspaceButton,
    WorkspacePageActions,
} from "@/components/workspace/ui";

import ActivityFilters from "@/components/workspace/crm/activities/ActivityFilters";
import ActivityTable, {
    type CRMActivity,
} from "@/components/workspace/crm/activities/ActivityTable";
import ActivityForm from "@/components/workspace/crm/activities/ActivityForm";

interface ActivityFilterCompany {
    id: string;
    name: string;
}

interface ActivityFilterContact {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
}

interface ActivityFilterLead {
    id: string;
    title: string;
}

interface ActivityFilterDeal {
    id: string;
    title: string;
}

interface ActivitiesPageClientProps {
    activities: CRMActivity[];
    companies: ActivityFilterCompany[];
    contacts: ActivityFilterContact[];
    leads: ActivityFilterLead[];
    deals: ActivityFilterDeal[];
}

export default function ActivitiesPageClient({
    activities,
    companies,
    contacts,
    leads,
    deals,
}: ActivitiesPageClientProps) {
    const [isAdding, setIsAdding] = useState(false);

    return (
        <>
            <div className="flex items-center justify-end">
                <WorkspacePageActions>
                    <WorkspaceButton
                        type="button"
                        onClick={() => setIsAdding(true)}
                        disabled={isAdding}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Log Activity
                    </WorkspaceButton>
                </WorkspacePageActions>
            </div>

            {isAdding && (
                <ActivityForm
                    companies={companies}
                    contacts={contacts}
                    leads={leads}
                    deals={deals}
                    onCancel={() => setIsAdding(false)}
                />
            )}

            {!isAdding && (
                <>
                    <ActivityFilters
                        companies={companies}
                        contacts={contacts}
                        leads={leads}
                        deals={deals}
                    />

                    <ActivityTable activities={activities} />
                </>
            )}
        </>
    );
}