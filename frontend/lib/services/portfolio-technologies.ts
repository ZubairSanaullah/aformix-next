import { Prisma, PortfolioTechnology } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export class PortfolioTechnologyServiceError extends Error {
    status: 400 | 404 | 409 | 500;

    constructor(message: string, status: 400 | 404 | 409 | 500) {
        super(message);
        this.name = "PortfolioTechnologyServiceError";
        this.status = status;
    }
}

function isUniqueConstraintError(
    error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
    return (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
    );
}

export async function getPortfolioTechnologies(
    search?: string,
): Promise<PortfolioTechnology[]> {
    return prisma.portfolioTechnology.findMany({
        where: {
            deletedAt: null,
            ...(search
                ? { name: { contains: search, mode: "insensitive" } }
                : {}),
        },
        orderBy: { name: "asc" },
    });
}

export async function createPortfolioTechnology(input: {
    name: string;
    slug: string;
    description?: string | null;
}): Promise<PortfolioTechnology> {
    try {
        return await prisma.portfolioTechnology.create({
            data: {
                name: input.name.trim(),
                slug: input.slug.trim().toLowerCase(),
                description: input.description?.trim() || null,
            },
        });
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new PortfolioTechnologyServiceError(
                "A technology with this name or slug already exists.",
                409,
            );
        }

        console.error("[PORTFOLIO_TECHNOLOGY_SERVICE_CREATE]", error);
        throw new PortfolioTechnologyServiceError(
            "Failed to create technology.",
            500,
        );
    }
}
