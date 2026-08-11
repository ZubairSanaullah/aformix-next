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

export default function TaskFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const search =
        searchParams.get("search") ?? "";

    const status =
        searchParams.get("status") ?? "";

    const priority =
        searchParams.get("priority") ?? "";

    const due =
        searchParams.get("due") ?? "";

    function updateFilter(
        key: string,
        value: string
    ) {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        router.push(
            `/workspace/tasks?${params.toString()}`
        );
    }

    function clearFilters() {
        router.push("/workspace/tasks");
    }

    const hasFilters = Boolean(
        search ||
        status ||
        priority ||
        due
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
                placeholder="Search tasks..."
                aria-label="Search tasks"
            />

            {/* Status */}

            <WorkspaceSelect
                value={status}
                onChange={(event) =>
                    updateFilter(
                        "status",
                        event.target.value
                    )
                }
                aria-label="Filter tasks by status"
            >
                <option value="">
                    All statuses
                </option>

                <option value="TODO">
                    To Do
                </option>

                <option value="IN_PROGRESS">
                    In Progress
                </option>

                <option value="COMPLETED">
                    Completed
                </option>

                <option value="CANCELLED">
                    Cancelled
                </option>
            </WorkspaceSelect>

            {/* Priority */}

            <WorkspaceSelect
                value={priority}
                onChange={(event) =>
                    updateFilter(
                        "priority",
                        event.target.value
                    )
                }
                aria-label="Filter tasks by priority"
            >
                <option value="">
                    All priorities
                </option>

                <option value="LOW">
                    Low
                </option>

                <option value="MEDIUM">
                    Medium
                </option>

                <option value="HIGH">
                    High
                </option>

                <option value="URGENT">
                    Urgent
                </option>
            </WorkspaceSelect>

            {/* Due Date */}

            <WorkspaceSelect
                value={due}
                onChange={(event) =>
                    updateFilter(
                        "due",
                        event.target.value
                    )
                }
                aria-label="Filter tasks by due date"
            >
                <option value="">
                    All due dates
                </option>

                <option value="overdue">
                    Overdue
                </option>

                <option value="today">
                    Today
                </option>

                <option value="upcoming">
                    Upcoming
                </option>

                <option value="none">
                    No due date
                </option>
            </WorkspaceSelect>
        </WorkspaceFilterBar>
    );
}