import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface SEOSettingsData {
    siteTitle?: string | null;
    siteDescription?: string | null;
    canonicalUrl?: string | null;
    defaultOgImage?: string | null;
    twitterHandle?: string | null;
    defaultRobotsIndex?: "INDEX" | "NOINDEX";
    defaultRobotsFollow?: "FOLLOW" | "NOFOLLOW";
}

const seoSettingsSelect = {
    id: true,
    siteTitle: true,
    siteDescription: true,
    canonicalUrl: true,
    defaultOgImage: true,
    twitterHandle: true,
    defaultRobotsIndex: true,
    defaultRobotsFollow: true,
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.SEOSettingsSelect;

export async function getSEOSettings() {
    return prisma.sEOSettings.findFirst({
        select: seoSettingsSelect,
        orderBy: {
            createdAt: "asc",
        },
    });
}

export async function createSEOSettings(
    data: SEOSettingsData = {}
) {
    const existing = await getSEOSettings();

    if (existing) {
        throw new Error(
            "SEO settings already exist."
        );
    }

    return prisma.sEOSettings.create({
        data: {
            siteTitle: data.siteTitle ?? null,
            siteDescription:
                data.siteDescription ?? null,
            canonicalUrl:
                data.canonicalUrl ?? null,
            defaultOgImage:
                data.defaultOgImage ?? null,
            twitterHandle:
                data.twitterHandle ?? null,
            defaultRobotsIndex:
                data.defaultRobotsIndex !== undefined
                    ? data.defaultRobotsIndex === "INDEX"
                    : true,
            defaultRobotsFollow:
                data.defaultRobotsFollow !== undefined
                    ? data.defaultRobotsFollow === "FOLLOW"
                    : true,
        },
        select: seoSettingsSelect,
    });
}

export async function updateSEOSettings(
    data: SEOSettingsData
) {
    const existing = await getSEOSettings();

    if (!existing) {
        return prisma.sEOSettings.create({
            data: {
                siteTitle: data.siteTitle ?? null,
                siteDescription:
                    data.siteDescription ?? null,
                canonicalUrl:
                    data.canonicalUrl ?? null,
                defaultOgImage:
                    data.defaultOgImage ?? null,
                twitterHandle:
                    data.twitterHandle ?? null,
                defaultRobotsIndex:
                    data.defaultRobotsIndex !== undefined
                        ? data.defaultRobotsIndex === "INDEX"
                        : true,
                defaultRobotsFollow:
                    data.defaultRobotsFollow !== undefined
                        ? data.defaultRobotsFollow === "FOLLOW"
                        : true,
            },
            select: seoSettingsSelect,
        });
    }

    const updateData: Prisma.SEOSettingsUpdateInput =
        {};

    if (data.siteTitle !== undefined) {
        updateData.siteTitle = data.siteTitle;
    }

    if (data.siteDescription !== undefined) {
        updateData.siteDescription =
            data.siteDescription;
    }

    if (data.canonicalUrl !== undefined) {
        updateData.canonicalUrl =
            data.canonicalUrl;
    }

    if (data.defaultOgImage !== undefined) {
        updateData.defaultOgImage =
            data.defaultOgImage;
    }

    if (data.twitterHandle !== undefined) {
        updateData.twitterHandle =
            data.twitterHandle;
    }

    if (data.defaultRobotsIndex !== undefined) {
        updateData.defaultRobotsIndex =
            data.defaultRobotsIndex === "INDEX";
    }

    if (data.defaultRobotsFollow !== undefined) {
        updateData.defaultRobotsFollow =
            data.defaultRobotsFollow === "FOLLOW";
    }

    return prisma.sEOSettings.update({
        where: {
            id: existing.id,
        },
        data: updateData,
        select: seoSettingsSelect,
    });
}