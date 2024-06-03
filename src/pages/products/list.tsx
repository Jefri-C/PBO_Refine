import {
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    useTable,
    NumberField
} from "@refinedev/antd";
import { BaseRecord, useMany, useList, useInvalidate } from "@refinedev/core";
import { Space, Table } from "antd";

interface ICategory {
    id: number;
    name: string;
}

interface IProduct extends BaseRecord {
    id: number;
    name: string;
    category_id: number;
    price: number;
}

const PRODUCT_DELETE_URL = "product/delete";

export const ProductList = () => {
    const { tableProps } = useTable<IProduct>({
        syncWithLocation: false,
    });

    const invalidate = useInvalidate();


    const rawData = tableProps.dataSource || { data: [] };
    const data = rawData.data;

    const categoryIds = Array.isArray(data)
        ? data.map((item) => item.category_id)
        : [];
    const { data: categoryData, isLoading: categoryIsLoading } = useList<ICategory>({
        resource: "category",
        // ids: categoryIds,
        queryOptions: {
            enabled: categoryIds.length > 0,
        },
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id" dataSource={data}>
                <Table.Column
                    title={"No."}
                    render={(_, __, index) => index + 1}
                />
                <Table.Column dataIndex="name" title={"Name"} />
                <Table.Column
                    dataIndex="category_id"
                    title={"Category"}
                    render={(value) => {
                        if (categoryIsLoading) {
                            return "Loading...";
                        }
                        return (
                            categoryData?.data.data.find((item) => item.id === value)?.name || "Unknown"
                        );
                    }}
                />
                <Table.Column dataIndex="price" title={"Price"} 
                    render={(value) => (
                        <NumberField
                            value={value}
                            options={{ style: "currency", currency: "IDR" }}
                        />
                    )} 
                />
                <Table.Column dataIndex="stock" title={"Stock"} />
                <Table.Column
                    title={"Actions"}
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <EditButton hideText size="small" recordItemId={record.id} />
                            <ShowButton hideText size="small" recordItemId={record.id} />
                            <DeleteButton hideText size="small" 
                            recordItemId={record.id}
                                resource={PRODUCT_DELETE_URL}
                                onSuccess={() => {
                                    invalidate({
                                        resource: "product",
                                        invalidates: ["list", "many"], // Specify the invalidation scopes
                                    });
                                }}
                                successNotification={(data, id, resource) => {
                                    return {
                                        message: `Successfully deleted product`,
                                        description: "Success",
                                        type: "success",
                                    };
                                }}
                            />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};