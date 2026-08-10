"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { WorkspaceButton } from "@/components/workspace/ui";

import AddCompanyInlineForm from "./AddCompanyInlineForm";

export default function CompanyCreatePanel() {
    const [isAdding, setIsAdding] = useState(false);

    if (isAdding) {
        return (
            <AddCompanyInlineForm
                onCancel={() => setIsAdding(false)}
            />
        );
    }

    return (
        <WorkspaceButton
            type="button"
            onClick={() => setIsAdding(true)}
        >
            <Plus className="mr-2 h-4 w-4" />
            Add Company
        </WorkspaceButton>
    );
}
