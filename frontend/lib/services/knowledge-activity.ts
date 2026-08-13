import { ActivityType, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export interface KnowledgeActivityInput {
    type: ActivityType;
    title: string;
    description?: string | null;
    userId: string;
    knowledgeArticleId?: string;
    knowledgeCategoryId?: string;
}

export async function createKnowledgeActivity(
    input: KnowledgeActivityInput
) {
    const {
        type,
        title,
        description,
        userId,
        knowledgeArticleId,
        knowledgeCategoryId,
    } = input;

    const data: Prisma.ActivityUncheckedCreateInput = {
        type,
        title,
        description: description ?? null,
        userId,
        knowledgeArticleId: knowledgeArticleId ?? null,
        knowledgeCategoryId: knowledgeCategoryId ?? null,
    };

    return prisma.activity.create({
        data,
    });
}