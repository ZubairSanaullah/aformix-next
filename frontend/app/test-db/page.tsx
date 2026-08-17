import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TestDbPage() {
    const posts = await prisma.post.findMany();

    return (
        <main className="p-10">
            <h1 className="text-3xl font-bold mb-6">
                Database Test
            </h1>

            <p>Total Posts: {posts.length}</p>

            <pre className="mt-6 rounded bg-neutral-900 p-4 text-white overflow-auto">
                {JSON.stringify(posts, null, 2)}
            </pre>
        </main>
    );
}