import { getAllRelationshipOptions } from "@/lib/api/scheduler-relationships";
import CreateEventClient from "./CreateEventClient";

export default async function CreateEventPage() {
    const { contacts, companies, leads, deals, tasks } =
        await getAllRelationshipOptions();

    return (
        <CreateEventClient
            contacts={contacts}
            companies={companies}
            leads={leads}
            deals={deals}
            tasks={tasks}
        />
    );
}
