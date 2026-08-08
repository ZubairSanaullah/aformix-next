"use client";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const data = [
    {
        month: "Jan",
        projects: 12,
    },
    {
        month: "Feb",
        projects: 18,
    },
    {
        month: "Mar",
        projects: 15,
    },
    {
        month: "Apr",
        projects: 24,
    },
    {
        month: "May",
        projects: 30,
    },
];

function CustomTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: Array<{
        value: number;
    }>;
    label?: string;
}) {
    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div
            className="
                rounded-lg
                border
                border-[var(--workspace-border)]
                bg-[var(--workspace-surface)]
                px-3
                py-2
                shadow-[0_8px_30px_rgba(15,23,42,0.08)]
            "
        >
            <p className="text-[10px] font-semibold text-[var(--workspace-text)]">
                {label}
            </p>

            <p className="mt-1 text-[11px] text-[var(--workspace-text-muted)]">
                {payload[0].value} projects
            </p>
        </div>
    );
}

export default function ProjectGrowthChart() {
    return (
        <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid
                        vertical={false}
                        stroke="var(--workspace-border)"
                        strokeDasharray="3 3"
                    />

                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fill: "var(--workspace-text-subtle)",
                            fontSize: 10,
                        }}
                        dy={8}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fill: "var(--workspace-text-subtle)",
                            fontSize: 10,
                        }}
                        width={35}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{
                            stroke: "var(--workspace-border)",
                            strokeDasharray: "4 4",
                        }}
                    />

                    <Line
                        type="monotone"
                        dataKey="projects"
                        stroke="var(--workspace-primary)"
                        strokeWidth={2.5}
                        dot={{
                            r: 3,
                            fill: "var(--workspace-surface)",
                            stroke: "var(--workspace-primary)",
                            strokeWidth: 2,
                        }}
                        activeDot={{
                            r: 5,
                            fill: "var(--workspace-primary)",
                            stroke: "var(--workspace-surface)",
                            strokeWidth: 2,
                        }}
                        animationDuration={700}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}