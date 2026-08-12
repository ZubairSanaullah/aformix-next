import WorkspacePageHeader from "@/components/workspace/ui/WorkspacePageHeader";
import CalendarView from "@/components/workspace/scheduler/CalendarView";

export default function SchedulerPage() {
    return (
        <div className="mx-auto w-full max-w-[1600px] space-y-6">
            <WorkspacePageHeader
                title="Scheduler"
                description="Manage meetings, calls, and appointments across your workspace."
                breadcrumbs={[{ label: "Scheduler" }]}
            />

            <CalendarView />
        </div>
    );
}
