import { auth } from "@/auth";

export default async function ProfilePage() {
    const session = await auth();

    return (
        <main className="p-10">
            <h1 className="text-3xl font-bold mb-6">Profile</h1>

            <pre className="rounded-lg bg-neutral-900 p-6 text-white overflow-auto">
                {JSON.stringify(session, null, 2)}
            </pre>
        </main>
    );
}