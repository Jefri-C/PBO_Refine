import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useCustom } from "@refinedev/core";

interface ISalesRevenue {
    total_amount: number;
    date: string;
}

interface RevenueChartProps {
    dateRange: {
        start: string;
        end: string;
    };
}

export const SalesRevenueChart: React.FC<RevenueChartProps> = ({ dateRange }) => {
    const API_URL = "https://pbouas.pythonanywhere.com"; // Replace with your actual API base URL
    const { start, end } = dateRange;
    const startDate = start.split("T")[0]; // Extracting only the date part
    const endDate = end.split("T")[0]; // Extracting only the date part

    const { data, isLoading } = useCustom<{ data: ISalesRevenue[] }>({
        url: `${API_URL}/api/sale`,
        method: "get",
        config: {
            query: { start: startDate, end: endDate }, // Passing only the date part
        }
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Aggregate total_amount by date
    const aggregatedData = data?.data.data.reduce((acc, item) => {
        const date = new Date(item.date).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = { date, total_amount: 0 };
        }
        acc[date].total_amount += item.total_amount;
        return acc;
    }, {});

    // Convert aggregated data to an array
    const transformedData = Object.values(aggregatedData || {});

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const currencyFormatter = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "IDR",
            });

            return (
                <div className="custom-tooltip" style={{ backgroundColor: "#fff", padding: "10px", border: "1px solid #ccc" }}>
                    <p className="label">{`${label}`}</p>
                    <p className="intro">{`Revenue: ${currencyFormatter.format(payload[0].value)}`}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={transformedData}>
                <defs>
                    <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="lightblue" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="lightblue" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                    content={<CustomTooltip />}
                />
                <Area type="monotone" dataKey="total_amount" stroke="lightblue" fillOpacity={1} fill="url(#colorGrad)" />
            </AreaChart>
        </ResponsiveContainer>
    );
};