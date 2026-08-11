"use client";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import {
    WorkspaceFilterBar,
    WorkspaceInput,
    WorkspaceSelect,
} from "@/components/workspace/ui";

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

interface DealFiltersProps {
    companies: DealFilterCompany[];
    contacts: DealFilterContact[];
    pipelines: DealFilterPipeline[];
}

export default function DealFilters({
    companies,
    contacts,
    pipelines,
}: DealFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const search =
        searchParams.get("search") ?? "";

    const pipelineId =
        searchParams.get("pipelineId") ?? "";

    const stageId =
        searchParams.get("stageId") ?? "";

    const companyId =
        searchParams.get("companyId") ?? "";

    const contactId =
        searchParams.get("contactId") ?? "";

    const updateFilter = (
        key: string,
        value: string
    ) => {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        // Changing pipeline resets stage, since stages belong to a pipeline
        if (key === "pipelineId") {
            params.delete("stageId");
        }

        router.push(
            `/workspace/crm/deals?${params.toString()}`
        );
    };

    const clearFilters = () => {
        router.push(
            "/workspace/crm/deals"
        );
    };

    const hasFilters = Boolean(
        search ||
        pipelineId ||
        stageId ||
        companyId ||
        contactId
    );

    const activePipeline = pipelines.find(
        (pipeline) => pipeline.id === pipelineId
    );

    return (
        <WorkspaceFilterBar
            onClear={
                hasFilters
                    ? clearFilters
                    : undefined
            }
        >
            {/* Search */}

            <WorkspaceInput
                value={search}
                onChange={(event) =>
                    updateFilter(
                        "search",
                        event.target.value
                    )
                }
                placeholder="Search deals..."
                aria-label="Search deals"
            />

            {/* Pipeline */}

            <WorkspaceSelect
                value={pipelineId}
                onChange={(event) =>
                    updateFilter(
                        "pipelineId",
                        event.target.value
                    )
                }
                aria-label="Filter deals by pipeline"
            >
                <option value="">
                    All pipelines
                </option>

                {pipelines.map((pipeline) => (
                    <option
                        key={pipeline.id}
                        value={pipeline.id}
                    >
                        {pipeline.name}
                    </option>
                ))}
            </WorkspaceSelect>

            {/* Stage (scoped to selected pipeline) */}

            <WorkspaceSelect
                value={stageId}
                onChange={(event) =>
                    updateFilter(
                        "stageId",
                        event.target.value
                    )
                }
                aria-label="Filter deals by stage"
                disabled={!activePipeline}
            >
                <option value="">
                    All stages
                </option>

                {activePipeline?.stages.map((stage) => (
                    <option
                        key={stage.id}
                        value={stage.id}
                    >
                        {stage.name}
                    </option>
                ))}
            </WorkspaceSelect>

            {/* Company */}

            <WorkspaceSelect
                value={companyId}
                onChange={(event) =>
                    updateFilter(
                        "companyId",
                        event.target.value
                    )
                }
                aria-label="Filter deals by company"
            >
                <option value="">
                    All companies
                </option>

                {companies.map((company) => (
                    <option
                        key={company.id}
                        value={company.id}
                    >
                        {company.name}
                    </option>
                ))}
            </WorkspaceSelect>

            {/* Contact */}

            <WorkspaceSelect
                value={contactId}
                onChange={(event) =>
                    updateFilter(
                        "contactId",
                        event.target.value
                    )
                }
                aria-label="Filter deals by contact"
            >
                <option value="">
                    All contacts
                </option>

                {contacts.map((contact) => {
                    const name = [
                        contact.firstName,
                        contact.lastName,
                    ]
                        .filter(Boolean)
                        .join(" ");

                    return (
                        <option
                            key={contact.id}
                            value={contact.id}
                        >
                            {name ||
                                contact.email ||
                                "Unnamed Contact"}
                        </option>
                    );
                })}
            </WorkspaceSelect>
        </WorkspaceFilterBar>
    );
}