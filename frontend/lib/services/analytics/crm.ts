import { prisma } from "@/lib/prisma";

export async function getCrmAnalytics(startDate: Date, endDate: Date) {
    const leads = await prisma.lead.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate,
            }
        },
        select: {
            status: true,
            source: true,
        }
    });

    const totalLeads = leads.length;
    let newLeads = 0;
    let contactedLeads = 0;
    let qualifiedLeads = 0;
    let convertedLeads = 0;
    let lostLeads = 0;
    
    const leadSources: Record<string, { count: number; converted: number }> = {};

    for (const lead of leads) {
        if (lead.status === "NEW") newLeads++;
        else if (lead.status === "CONTACTED") contactedLeads++;
        else if (lead.status === "QUALIFIED") qualifiedLeads++;
        else if (lead.status === "CONVERTED") convertedLeads++;
        else if (lead.status === "LOST") lostLeads++;

        if (lead.source) {
            if (!leadSources[lead.source]) {
                leadSources[lead.source] = { count: 0, converted: 0 };
            }
            leadSources[lead.source].count++;
            if (lead.status === "CONVERTED") {
                leadSources[lead.source].converted++;
            }
        }
    }

    const leadConversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    const sourceAnalytics = Object.entries(leadSources).map(([source, data]) => ({
        source,
        leadCount: data.count,
        convertedCount: data.converted,
        conversionRate: data.count > 0 ? Number(((data.converted / data.count) * 100).toFixed(2)) : 0
    })).sort((a, b) => b.leadCount - a.leadCount);

    const deals = await prisma.deal.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate,
            }
        },
        select: {
            value: true,
            closedAt: true,
            stage: {
                select: {
                    id: true,
                    name: true,
                    order: true
                }
            }
        }
    });

    const totalDeals = deals.length;
    let openDeals = 0;
    let closedDeals = 0;
    let totalPipelineValue = 0;
    let closedRevenue = 0;
    
    const pipelineStages: Record<string, { name: string, order: number, count: number, value: number }> = {};

    for (const deal of deals) {
        const value = deal.value ? Number(deal.value) : 0;
        totalPipelineValue += value;

        if (deal.closedAt) {
            closedDeals++;
            closedRevenue += value;
        } else {
            openDeals++;
        }

        const stageId = deal.stage.id;
        if (!pipelineStages[stageId]) {
            pipelineStages[stageId] = {
                name: deal.stage.name,
                order: deal.stage.order,
                count: 0,
                value: 0
            };
        }
        pipelineStages[stageId].count++;
        pipelineStages[stageId].value += value;
    }

    const pipeline = Object.values(pipelineStages).sort((a, b) => a.order - b.order).map(stage => ({
        name: stage.name,
        dealCount: stage.count,
        totalValue: stage.value
    }));

    return {
        leads: {
            total: totalLeads,
            new: newLeads,
            contacted: contactedLeads,
            qualified: qualifiedLeads,
            converted: convertedLeads,
            lost: lostLeads,
            conversionRate: Number(leadConversionRate.toFixed(2)),
            sources: sourceAnalytics
        },
        deals: {
            total: totalDeals,
            open: openDeals,
            closed: closedDeals,
            totalPipelineValue,
            closedRevenue,
            pipeline
        }
    };
}
