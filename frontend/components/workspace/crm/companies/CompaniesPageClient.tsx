"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import {
    WorkspaceButton,
    WorkspacePageActions,
} from "@/components/workspace/ui";

import CompanyFilters from "./CompanyFilters";
import CompanyTable, { CRMCompany } from "./CompanyTable";
import AddCompanyInlineForm from "./AddCompanyInlineForm";

interface CompaniesPageClientProps {
    companies: CRMCompany[];
    search: string;
    status: "ACTIVE" | "INACTIVE" | "ARCHIVED" | "";
}

export default function CompaniesPageClient({
    companies,
}: CompaniesPageClientProps) {
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
                        Add Company
                    </WorkspaceButton>
                </WorkspacePageActions>
            </div>

            {isAdding && (
                <AddCompanyInlineForm
                    onCancel={() => setIsAdding(false)}
                />
            )}

            <CompanyFilters />

            <CompanyTable companies={companies} />
        </>
    );
}