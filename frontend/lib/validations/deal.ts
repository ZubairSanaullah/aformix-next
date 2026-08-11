import { z } from "zod";

export const dealSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(200, "Title must be less than 200 characters"),
    description: z
        .string()
        .max(2000, "Description must be less than 2000 characters")
        .optional()
        .nullable(),
    value: z
        .coerce.number()
        .min(0, "Value must be a positive number")
        .optional()
        .nullable(),
    pipelineId: z.string().min(1, "Pipeline is required"),
    stageId: z.string().min(1, "Stage is required"),
    contactId: z.string().optional().nullable(),
    companyId: z.string().optional().nullable(),
    leadId: z.string().optional().nullable(),
    ownerId: z.string().min(1, "Owner is required"),
    closedAt: z
        .coerce.date()
        .optional()
        .nullable(),
});

export type DealInput = z.infer<typeof dealSchema>;

export const dealUpdateSchema = dealSchema.partial();

export type DealUpdateInput = z.infer<typeof dealUpdateSchema>;

export const pipelineSchema = z.object({
    name: z
        .string()
        .min(1, "Pipeline name is required")
        .max(100, "Pipeline name must be less than 100 characters"),
    description: z
        .string()
        .max(500, "Description must be less than 500 characters")
        .optional()
        .nullable(),
    isDefault: z.boolean().optional(),
});

export type PipelineInput = z.infer<typeof pipelineSchema>;

export const pipelineUpdateSchema = pipelineSchema.partial();

export type PipelineUpdateInput = z.infer<typeof pipelineUpdateSchema>;

export const pipelineStageSchema = z.object({
    name: z
        .string()
        .min(1, "Stage name is required")
        .max(100, "Stage name must be less than 100 characters"),
    description: z
        .string()
        .max(500, "Description must be less than 500 characters")
        .optional()
        .nullable(),
    order: z.coerce.number().int().min(0, "Order must be a positive integer"),
    color: z.string().optional().nullable(),
    pipelineId: z.string().min(1, "Pipeline is required"),
});

export type PipelineStageInput = z.infer<typeof pipelineStageSchema>;

export const pipelineStageUpdateSchema = pipelineStageSchema.partial();

export type PipelineStageUpdateInput = z.infer<typeof pipelineStageUpdateSchema>;