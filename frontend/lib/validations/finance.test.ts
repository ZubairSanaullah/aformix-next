import { describe, expect, it } from "vitest";

import {
    createFinanceCategorySchema,
    financeCategoryListQuerySchema,
} from "./finance";

describe("finance validation", () => {
    it("accepts a valid category payload", () => {
        const parsed = createFinanceCategorySchema.parse({
            name: "Consulting",
            slug: "consulting",
            type: "INCOME",
            description: "Client consulting revenue",
            color: "#22c55e",
            sortOrder: 1,
        });

        expect(parsed.name).toBe("Consulting");
        expect(parsed.slug).toBe("consulting");
        expect(parsed.type).toBe("INCOME");
    });

    it("rejects an invalid category type", () => {
        expect(() =>
            createFinanceCategorySchema.parse({
                name: "Hosting",
                slug: "hosting",
                type: "INVALID_TYPE",
            })
        ).toThrow();
    });

    it("validates list query defaults", () => {
        const parsed = financeCategoryListQuerySchema.parse({
            page: "2",
            limit: "10",
            includeDeleted: "true",
        });

        expect(parsed.page).toBe(2);
        expect(parsed.limit).toBe(10);
        expect(parsed.includeDeleted).toBe(true);
        expect(parsed.sortBy).toBe("sortOrder");
        expect(parsed.sortOrder).toBe("asc");
    });
});
