import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function CreateTestPostPage() {
    let user = await prisma.user.findFirst();
    if (!user) {
        user = await prisma.user.create({
            data: {
                name: "Test User",
                email: "test@test-db.com",
                password: "dummy_password",
            }
        });
    }

    const existingPost = await prisma.post.findUnique({
        where: {
            slug: "hello-world",
        },
    });

    if (!existingPost) {
        await prisma.post.create({
            data: {
                title: "Hello World",
                slug: "hello-world",
                excerpt: "This is the first blog post.",
                content: "Welcome to the Aformix Workspace Blog CMS!",
                status: PostStatus.DRAFT,
                seoTitle: "Hello World",
                seoDescription: "First blog post created with Prisma.",
                seoKeywords: "hello, prisma, nextjs",
                authorId: user.id,
            },
        });
    }

    return (
        <main className="p-10">
            <h1 className="text-3xl font-bold">
                ✅ Test post created successfully!
            </h1>

            <p className="mt-4">
                Refresh <strong>/test-db</strong> to verify the post appears.
            </p>
        </main>
    );
}