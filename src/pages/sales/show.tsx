import { NumberField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Table, Col, Row } from "antd";

const { Title } = Typography;

export const SaleShow = () => {
    const { queryResult } = useShow({});
    const { data, isLoading } = queryResult;

    const record = data?.data.data;
    const details = data?.data.data.details;

    const ageRangeMapping = {
        1: "< 20",
        2: "20-29",
        3: "30-39",
        4: "40-49",
        5: "50-59",
        6: "≥ 60"
    };

    return (
        <Show isLoading={isLoading} canDelete={false}>
            <Title level={5}>{"ID"}</Title>
            <NumberField value={record?.id ?? ""} />
            <Row gutter={8} style={{ paddingTop: '32px' }}>
                <Col span={4}>
            <Title level={5}>{"Date"}</Title>
            <TextField value={record?.date} />
            </Col>
            <Col span={4}>
            <Title level={5}>{"Payment Method"}</Title>
            <TextField value={record?.payment_method} />
            </Col>
            </Row>
            <Row gutter={8} style={{paddingTop: '32px', paddingBottom: '32px'}}>
                <Col span={4}>
                    <Title level={5}>{"Customer Age"}</Title>
                    <TextField value={ageRangeMapping[record?.age]} />
                </Col>
                <Col span={4}>
                    <Title level={5}>{"Customer Gender"}</Title>
                    <TextField value={record?.gender === 'F' ? 'Female' : 'Male'} />
                </Col>
            </Row>
            <Title level={5}>{"Details"}</Title>
            <Table dataSource={details} rowKey="id" pagination={false}>
                <Table.Column
                    title={"No."}
                    render={(_, __, index) => index + 1}
                />
                <Table.Column dataIndex="product_name" title="Item" />
                <Table.Column dataIndex="quantity" title="Quantity" />
                <Table.Column dataIndex="sold_for" title="Price" 
                render={(value) => (
                    <NumberField
                        value={value}
                        options={{ style: "currency", currency: "IDR" }}
                    />
                )} />
                <Table.Column
                    title="Total Price"
                    render={(record) => (
                        <NumberField
                            value={record.quantity * record.sold_for}
                            options={{ style: "currency", currency: "IDR" }}
                        />
                    )}
                />
            </Table>
            <Title level={3} style={{paddingTop:'32px'}}>{"Grand Total"}</Title>
            <NumberField
                value={record?.total_amount}
                options={{ style: "currency", currency: "IDR" }}
                style={{fontSize: "24px"}}
            />
        </Show>
    );
};