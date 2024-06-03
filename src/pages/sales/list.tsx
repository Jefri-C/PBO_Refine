import {
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    useTable,
    NumberField
} from "@refinedev/antd";
import { BaseRecord, useInvalidate } from "@refinedev/core";
import { Space, Table } from "antd";

interface ISales {
    id: number;
    date: Date;
    payment_method: string;
    total_amount: number;
}

const SALES_DELETE_URL = "sale/delete";

export const SaleList = () => {
    const { tableProps } = useTable<ISales>({
        syncWithLocation: false,
    });

    const invalidate = useInvalidate();

    const rawData = tableProps.dataSource || { data: [] };
    const data = rawData.data.map((item, index) => ({
        ...item,
        autoIncrementId: index + 1,
    }));

    return (
        <List>
            <Table {...tableProps} dataSource={data} rowKey="id">
                <Table.Column
                    title={"No."}
                    render={(_, __, index) => index + 1}
                />
                {/* <Table.Column dataIndex="id" title={"ID"} /> */}
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
                <Table.Column
                    title={"Actions"}
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <EditButton hideText size="small" recordItemId={record.id} />
                            <ShowButton hideText size="small" recordItemId={record.id} />
                            <DeleteButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                                resource={SALES_DELETE_URL}
                                onSuccess={() => {
                                    invalidate({
                                        resource: "sale",
                                        invalidates: ["list", "many"], // Specify the invalidation scopes
                                    });
                                }}
                                successNotification={(data, id, resource) => {
                                    return {
                                        message: `Successfully deleted category`,
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
