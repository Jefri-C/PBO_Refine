import { BaseRecord, useCustom, useGetIdentity, usePermissions } from "@refinedev/core";

import { Row, Col, Card, Avatar, Typography, Space, Flex, MenuProps, Button, Dropdown, Table } from "antd";

const { Text } = Typography;

import {
    ClockCircleOutlined,
    DollarCircleOutlined,
    DownOutlined,
    RiseOutlined,
    ShoppingOutlined,
    UserOutlined,
    UpOutlined,
    StockOutlined,
    DollarOutlined,
    ProductOutlined,
    RobotOutlined,

} from "@ant-design/icons";
import { DeleteButton, EditButton, List, NumberField, ShowButton, TextField } from "@refinedev/antd";
import { PropsWithChildren, useMemo, useState } from "react";
import dayjs from "dayjs";
import { SalesChart, SalesRevenueChart } from "./charts";
import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Pred } from "./forms/pred";


type DateFilter = "lastWeek" | "lastMonth";

const DATE_FILTERS: Record<
    DateFilter,
    {
        text: string;
        value: DateFilter;
    }
> = {
    lastWeek: {
        text: "Last Week",
        value: "lastWeek",
    },
    lastMonth: {
        text: "Last Month",
        value: "lastMonth",
    },
};


export const DashboardPage: React.FC = () => {
    const [selectedDateFilter, setSelectedDateFilter] = useState<DateFilter>(
        DATE_FILTERS.lastWeek.value,
    );

    const dateFilters: MenuProps["items"] = useMemo(() => {
        const filters = Object.keys(DATE_FILTERS) as DateFilter[];

        return filters.map((filter) => {
            return {
                key: DATE_FILTERS[filter].value,
                label: (`${DATE_FILTERS[filter].text}`),
                onClick: () => {
                    setSelectedDateFilter(DATE_FILTERS[filter].value);
                },
            };
        });
    }, []);

    const dateFilterQuery = useMemo(() => {
        const now = dayjs();
        switch (selectedDateFilter) {
            case "lastWeek":
                return {
                    start: now.subtract(6, "days").startOf("day").format(),
                    end: now.endOf("day").format(),
                };
            case "lastMonth":
                return {
                    start: now.subtract(1, "month").startOf("day").format(),
                    end: now.endOf("day").format(),
                };
            default:
                return {
                    start: now.subtract(7, "days").startOf("day").format(),
                    end: now.endOf("day").format(),
                };
        }
    }, [selectedDateFilter]);

    const API_URL = "https://pbouas.pythonanywhere.com"; // Replace with your actual API base URL

    const { data: todaySalesData } = useCustom<{ data: { date: string }[] }>({
        url: `${API_URL}/api/sale`,
        method: "get",
        config: {
            query: {
                start: dayjs().startOf("day").format("YYYY-MM-DD"),
                end: dayjs().endOf("day").format("YYYY-MM-DD"),
            },
        },
    });

    const { data: yesterdaySalesData } = useCustom<{ data: { date: string }[] }>({
        url: `${API_URL}/api/sale`,
        method: "get",
        config: {
            query: {
                start: dayjs().subtract(1, "day").startOf("day").format("YYYY-MM-DD"),
                end: dayjs().subtract(1, "day").endOf("day").format("YYYY-MM-DD"),
            },
        },
    });

    const { data: todayRevenueData } = useCustom<{ data: { total_amount: number }[] }>({
        url: `${API_URL}/api/sale`,
        method: "get",
        config: {
            query: {
                start: dayjs().startOf("day").format("YYYY-MM-DD"),
                end: dayjs().endOf("day").format("YYYY-MM-DD"),
            },
        },
    });

    const { data: yesterdayRevenueData } = useCustom<{ data: { total_amount: number }[] }>({
        url: `${API_URL}/api/sale`,
        method: "get",
        config: {
            query: {
                start: dayjs().subtract(1, "day").startOf("day").format("YYYY-MM-DD"),
                end: dayjs().subtract(1, "day").endOf("day").format("YYYY-MM-DD"),
            },
        },
    });

    const { data: productRankingData } = useCustom<{ data: { product_name:String, quantity: number }[] }>({
        url: `${API_URL}/api/sale`,
        method: "get",
    });

    // @ts-ignore

    const detailsData = productRankingData?.data?.data.map(item => item.details).flat();

    if (!detailsData) {
        return <div>No details data available</div>;
    }

    const totalQuantities = detailsData.reduce((acc, item) => {
        if (acc[item.product_name]) {
            acc[item.product_name] += item.quantity;
        } else {
            acc[item.product_name] = item.quantity;
        }
        return acc;
    }, {});

    const rankedProducts = Object.entries(totalQuantities)
        .map(([product_name, quantity]) => ({ product_name, quantity }))
        // @ts-ignore
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
    
    console.log(rankedProducts);



const todayRevenue = todayRevenueData?.data.data.reduce((sum, item) => sum += item.total_amount, 0) || 0;
const yesterdayRevenue = yesterdayRevenueData?.data.data.reduce((sum, item) => sum += item.total_amount, 0) || 0;
let revenuePercent = todayRevenue / yesterdayRevenue;


const todaySalesCount = todaySalesData?.data.data.length || 0;
const yesterdaySalesCount = yesterdaySalesData?.data.data.length || 0;

let salesPercent = yesterdaySalesCount !== 0 ? (todaySalesCount / yesterdaySalesCount) : 0;

if (salesPercent > 1) {
    salesPercent -= 1;
}

if (todaySalesCount == yesterdaySalesCount) {
    salesPercent = 0;
}

if (todayRevenue == yesterdayRevenue) {
    revenuePercent = 0;
}

if (revenuePercent > 1) {
    revenuePercent -= 1;
}



const CardWithPlot = (
    props: PropsWithChildren<{
        icon: React.ReactNode;
        title: string;
        rightSlot?: React.ReactNode;
        bodyStyles?: React.CSSProperties;
    }>,
) => {
    return (
        <Card
            styles={{
                header: {
                    padding: "16px 16px 10px 16px",
                    minHeight: "max-content",
                    borderBottom: 0,
                },
                body: {
                    padding: "24px 16px 24px 24px",
                    ...(props?.bodyStyles || {}),
                },
            }}
            title={
                <Flex align="center" justify="space-between">
                    <Flex gap={8}>
                        {props.icon}
                        <Typography.Text
                            style={{
                                fontWeight: 400,
                            }}
                        >
                            {props.title}
                        </Typography.Text>
                    </Flex>
                    {props?.rightSlot}
                </Flex>
            }
        >
            {props.children}
        </Card>
    );
}

const CardWithContent = (
    props: PropsWithChildren<{
        icon?: React.ReactNode;
        title: string;
        bodyStyles?: React.CSSProperties;
    }>,
) => {
    return (
        <Card
            styles={{
                header: {
                    padding: "16px",
                },
                body: {
                    ...(props?.bodyStyles || {}),
                },
            }}
            title={
                <Space align="center" size={8}>
                    {props.icon}
                    <Typography.Text
                        style={{
                            fontWeight: 400,
                        }}
                    >
                        {props.title}
                    </Typography.Text>
                </Space>
            }
        >
            {props.children}
        </Card>
    );
};

return (
    <List
        title={("Dashboard")}
        headerButtons={() => (
            <Dropdown menu={{ items: dateFilters }}>
                <Button>
                    {(
                        `${DATE_FILTERS[selectedDateFilter].text}`
                    )}
                    <DownOutlined />
                </Button>
            </Dropdown>
        )}
    >
        <Row gutter={24}>
            <Col span={12}>
                <CardWithPlot
                    icon={
                        <StockOutlined
                            style={{
                                fontSize: 14,
                                color: "black",
                            }}
                        />
                    }
                    title={"Daily Revenue"}
                    rightSlot={
                        <Flex align="center" gap={8}>
                            <NumberField
                                value={revenuePercent}
                                options={{
                                    style: "percent",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }}

                            />
                            <TextField
                                value={"from Yesterday"} />
                            {todayRevenue > yesterdayRevenue ? (
                                <UpOutlined
                                    style={{
                                        color: "green"
                                    }} />
                            ) : (
                                <DownOutlined
                                    style={{
                                        color: "red"
                                    }} />
                            )}
                        </Flex>
                    }
                >
                    <SalesRevenueChart dateRange={dateFilterQuery} />
                </CardWithPlot>
            </Col>
            <Col span={12}>
                <CardWithPlot
                    icon={
                        <DollarOutlined
                            style={{
                                fontSize: 14,
                                color: "black",
                            }}
                        />
                    }
                    title={"Sales"}
                    rightSlot={
                        <Flex align="center" gap={8}>
                            <NumberField
                                value={salesPercent}
                                options={{
                                    style: "percent",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }}
                            />
                            <TextField
                                value={"from Yesterday"} />
                            {todaySalesCount > yesterdaySalesCount ? (
                                <UpOutlined
                                    style={{
                                        color: "green"
                                    }} />
                            ) : (
                                <DownOutlined
                                    style={{
                                        color: "red"
                                    }} />
                            )}
                        </Flex>
                    }
                >
                    <SalesChart dateRange={dateFilterQuery} />
                </CardWithPlot>
            </Col>
        </Row>

        <Row gutter={24} style={{ paddingTop: "24px" }}>
            <Col span={8}>
                <CardWithContent
                    icon={
                        <RiseOutlined
                            style={{
                                fontSize: 16,
                                color: "green",
                            }}
                        />
                    }
                    title={"Trending Products"}>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {rankedProducts.map((product, index) => (
                            <li key={index} style={{ marginBottom: "16px" }}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <span style={{
                                        fontSize: "24px",
                                        fontWeight: "bold",
                                        marginRight: "8px",
                                        paddingRight: "16px"
                                    }}>
                                        #{index + 1}
                                    </span>
                                    <div>
                                        <div style={{
                                            fontSize: "20px",
                                            fontWeight: "bold"
                                        }}>
                                            {product.product_name}
                                        </div>
                                        <div style={{
                                            fontSize: "16px",
                                            color: "gray"
                                        }}>
                                            Sold: {product.quantity}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardWithContent>
            </Col>
            {/* <Col span={9}>
                <CardWithContent
                    icon={
                        <ShoppingOutlined
                            style={{
                                fontSize: 16,
                                color: "green",
                            }}
                        />
                    }
                    title={"Recent Sales"}>
                    <Table dataSource={recentSalesData} rowKey="id">
                        <Table.Column
                            title={"No."}
                            render={(_, __, index) => index + 1}
                        />
                        <Table.Column dataIndex="id" title={"ID"} /> 
                        <Table.Column dataIndex="date" title={"Date"} />
                        <Table.Column dataIndex="payment_method" title={"Payment Method"} />
                        <Table.Column dataIndex="total_amount" title={"Grand Total"}
                            render={(value) => (
                                <NumberField
                                    value={value}
                                    options={{ style: "currency", currency: "IDR" }}
                                />
                            )}
                        />
                    </Table>
                </CardWithContent>
            </Col> */}
            <Col span={16}>
                <CardWithContent
                    icon={
                        <RobotOutlined
                            style={{
                                fontSize: 16,
                                color: "green",
                            }}
                        />
                    }
                    title={"Sales Prediction"}>
                    <Pred />
                </CardWithContent>
            </Col>
        </Row>
    </List>
);
};