"use client";

import { Plus } from "lucide-react";

import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";
import PortfolioCategoryFormDialog from "./PortfolioCategoryFormDialog";

export default function CreatePortfolioCategoryButton() {
    return (
        <PortfolioCategoryFormDialog
            mode="create"
            trigger={
                <WorkspaceButton variant="primary" size="md">
                    <Plus className="h-3.5 w-3.5" />
                    New Category
                </WorkspaceButton>
            }
        />
    );
}