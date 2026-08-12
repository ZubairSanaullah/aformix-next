import { getAllRelationshipOptions } from "@/lib/api/scheduler-relationships";
import EditEventClient from "./EditEventClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
    const { id } = await params;
    const { contacts, companies, leads, deals, tasks } =
        await getAllRelationshipOptions();

    return (
        <EditEventClient
            eventId={id}
            contacts={contacts}
            companies={companies}
            leads={leads}
            deals={deals}
            tasks={tasks}
        />
    );
}
