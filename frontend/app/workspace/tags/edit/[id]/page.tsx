import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import EditTagForm from "./EditTagForm";

export default async function EditTagPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const tag = await prisma.tag.findUnique({
        where: {
            id,
        },
    });

    if (!tag) {
        notFound();
    }

    return <EditTagForm tag={tag} />;
}