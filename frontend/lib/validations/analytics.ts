import { z } from "zod";

export const analyticsQuerySchema = z.object({
  period: z.enum([
    "today",
    "yesterday",
    "this_week",
    "last_week",
    "this_month",
    "last_month",
    "this_quarter",
    "last_quarter",
    "this_year",
    "last_year",
    "custom",
  ]).optional().default("this_month"),
  startDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), { message: "Invalid startDate" }),
  endDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), { message: "Invalid endDate" }),
}).refine((data) => {
  if (data.period === "custom") {
    if (!data.startDate || !data.endDate) {
      return false;
    }
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (start > end) {
      return false;
    }
  }
  return true;
}, {
  message: "startDate and endDate are required and startDate must be before endDate when using custom period",
  path: ["period"],
});

export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>;
