import { prisma } from "@/lib/prisma";
import type {
    DealInput,
    DealUpdateInput,
    PipelineInput,
    PipelineUpdateInput,
    PipelineStageInput,
    PipelineStageUpdateInput,
} from "@/lib/validations/deal";

// ---------- Deal CRUD ----------

export async function getDeals() {
    return prisma.deal.findMany({
        include: {
            pipeline: true,
            stage: true,
            contact: true,
            company: true,
            lead: true,
            owner: true,
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function getDealById(id: string) {
    return prisma.deal.findUnique({
        where: { id },
        include: {
            pipeline: true,
            stage: true,
            contact: true,
            company: true,
            lead: true,
            owner: true,
            activities: true,
            notes: true,
        },
    });
}

export async function createDeal(data: DealInput) {
    return prisma.deal.create({
        data: {
            title: data.title,
            description: data.description ?? undefined,
            value: data.value ?? undefined,
            pipelineId: data.pipelineId,
            stageId: data.stageId,
            contactId: data.contactId ?? undefined,
            companyId: data.companyId ?? undefined,
            leadId: data.leadId ?? undefined,
            ownerId: data.ownerId,
            closedAt: data.closedAt ?? undefined,
        },
    });
}

export async function updateDeal(id: string, data: DealUpdateInput) {
    return prisma.deal.update({
        where: { id },
        data: {
            ...(data.title !== undefined && { title: data.title }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.value !== undefined && { value: data.value }),
            ...(data.pipelineId !== undefined && { pipelineId: data.pipelineId }),
            ...(data.stageId !== undefined && { stageId: data.stageId }),
            ...(data.contactId !== undefined && { contactId: data.contactId }),
            ...(data.companyId !== undefined && { companyId: data.companyId }),
            ...(data.leadId !== undefined && { leadId: data.leadId }),
            ...(data.ownerId !== undefined && { ownerId: data.ownerId }),
            ...(data.closedAt !== undefined && { closedAt: data.closedAt }),
        },
    });
}

export async function deleteDeal(id: string) {
    return prisma.deal.delete({
        where: { id },
    });
}

// Used by the Kanban board when a deal is dragged to a new stage
export async function updateDealStage(id: string, stageId: string) {
    return prisma.deal.update({
        where: { id },
        data: { stageId },
    });
}

// ---------- Pipeline CRUD ----------

export async function getPipelines() {
    return prisma.pipeline.findMany({
        include: {
            stages: {
                orderBy: { order: "asc" },
            },
        },
        orderBy: { createdAt: "asc" },
    });
}

export async function getPipelineById(id: string) {
    return prisma.pipeline.findUnique({
        where: { id },
        include: {
            stages: {
                orderBy: { order: "asc" },
            },
            deals: true,
        },
    });
}

export async function createPipeline(data: PipelineInput) {
    return prisma.pipeline.create({
        data: {
            name: data.name,
            description: data.description ?? undefined,
            isDefault: data.isDefault ?? false,
        },
    });
}

export async function updatePipeline(id: string, data: PipelineUpdateInput) {
    return prisma.pipeline.update({
        where: { id },
        data: {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.isDefault !== undefined && { isDefault: data.isDefault }),
        },
    });
}

export async function deletePipeline(id: string) {
    return prisma.pipeline.delete({
        where: { id },
    });
}

// ---------- Pipeline Stage CRUD ----------

export async function getStagesByPipeline(pipelineId: string) {
    return prisma.pipelineStage.findMany({
        where: { pipelineId },
        orderBy: { order: "asc" },
    });
}

export async function getStageById(id: string) {
    return prisma.pipelineStage.findUnique({
        where: { id },
    });
}

export async function createStage(data: PipelineStageInput) {
    return prisma.pipelineStage.create({
        data: {
            name: data.name,
            description: data.description ?? undefined,
            order: data.order,
            color: data.color ?? undefined,
            pipelineId: data.pipelineId,
        },
    });
}

export async function updateStage(id: string, data: PipelineStageUpdateInput) {
    return prisma.pipelineStage.update({
        where: { id },
        data: {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.order !== undefined && { order: data.order }),
            ...(data.color !== undefined && { color: data.color }),
            ...(data.pipelineId !== undefined && { pipelineId: data.pipelineId }),
        },
    });
}

export async function deleteStage(id: string) {
    return prisma.pipelineStage.delete({
        where: { id },
    });
}

// Bulk reorder — takes an array of { id, order } and persists new positions
export async function reorderStages(
    updates: { id: string; order: number }[]
) {
    return prisma.$transaction(
        updates.map(({ id, order }) =>
            prisma.pipelineStage.update({
                where: { id },
                data: { order },
            })
        )
    );
}