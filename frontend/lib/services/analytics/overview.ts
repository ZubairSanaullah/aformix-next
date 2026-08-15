import { getCrmAnalytics } from "./crm";
import { getFinanceAnalytics } from "./finance";
import { getProjectAnalytics } from "./projects";
import { getContentAnalytics } from "./content";
import { getActivityAnalytics } from "./activity";
import { getPreviousPeriod, calculatePercentageChange } from "./utils";

export async function getAnalyticsOverview(startDate: Date, endDate: Date, compare: boolean = false) {
    const [crm, finance, projects, content, activity] = await Promise.all([
        getCrmAnalytics(startDate, endDate),
        getFinanceAnalytics(startDate, endDate),
        getProjectAnalytics(startDate, endDate),
        getContentAnalytics(startDate, endDate),
        getActivityAnalytics(startDate, endDate)
    ]);

    let previous = null;
    let comparisons = null;

    if (compare) {
        const { prevStartDate, prevEndDate } = getPreviousPeriod(startDate, endDate);
        
        const [prevCrm, prevFinance, prevProjects, prevContent, prevActivity] = await Promise.all([
            getCrmAnalytics(prevStartDate, prevEndDate),
            getFinanceAnalytics(prevStartDate, prevEndDate),
            getProjectAnalytics(prevStartDate, prevEndDate),
            getContentAnalytics(prevStartDate, prevEndDate),
            getActivityAnalytics(prevStartDate, prevEndDate)
        ]);

        previous = {
            crm: prevCrm,
            finance: prevFinance,
            projects: prevProjects,
            content: prevContent,
            activity: prevActivity
        };

        // Calculate specific comparison metrics
        comparisons = {
            revenue: calculatePercentageChange(finance.totalRevenue, prevFinance.totalRevenue),
            expenses: calculatePercentageChange(finance.totalExpenses, prevFinance.totalExpenses),
            netIncome: calculatePercentageChange(finance.netIncome, prevFinance.netIncome),
            leads: calculatePercentageChange(crm.leads.total, prevCrm.leads.total),
            deals: calculatePercentageChange(crm.deals.total, prevCrm.deals.total),
            projects: calculatePercentageChange(projects.projects.total, prevProjects.projects.total),
            activeProjects: calculatePercentageChange(projects.projects.active, prevProjects.projects.active),
            tasksCompleted: calculatePercentageChange(projects.tasks.completed, prevProjects.tasks.completed)
        };
    }

    return {
        current: {
            crm,
            finance,
            projects,
            content,
            activity
        },
        previous,
        comparisons
    };
}
