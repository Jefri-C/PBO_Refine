import { NumberField, Show, TextField } from "@refinedev/antd";
import { useShow, useOne } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export const ProductShow = () => {
    const { queryResult } = useShow({});
    const { data, isLoading } = queryResult;

    const record = data?.data.data;

    const { data: categoryData, isLoading: isCategoryLoading } = useOne({
        resource: "category",
        id: record?.category_id,
        queryOptions: {
            enabled: !!record?.category_id,
        },
    });

    return (
        <Show isLoading={isLoading || isCategoryLoading} canDelete={false}>
            <Title level={5}>{"ID"}</Title>
            <NumberField value={record?.id ?? ""} />
            <Title level={5}>{"Name"}</Title>
            <TextField value={record?.name} />
            <Title level={5}>{"Category"}</Title>
            <TextField value={categoryData?.data?.data.name ?? "Loading..."} />
            <Title level={5}>{"Price"}</Title>
            <NumberField
                value={record?.price}
                options={{ style: "currency", currency: "IDR" }}
            />
            <Title level={5}>{"Stock"}</Title>
            <TextField value={record?.stock} />
        </Show>
    );
};