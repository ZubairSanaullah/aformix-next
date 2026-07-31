"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
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
        <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-lg">
            <p className="text-sm font-medium">
                {label}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
                {payload[0].value} Projects
            </p>
        </div>
    );
}

export default function ProjectGrowthChart() {
    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: -10,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid
                        strokeDasharray="4 4"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{
                            strokeDasharray: "4 4",
                        }}
                    />

                    <Line
                        type="monotone"
                        dataKey="projects"
                        stroke="var(--color-primary)"
                        strokeWidth={3}
                        dot={{
                            r: 4,
                        }}
                        activeDot={{
                            r: 6,
                        }}
                        animationDuration={1000}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}