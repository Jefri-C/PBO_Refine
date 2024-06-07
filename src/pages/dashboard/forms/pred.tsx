import { useForm, useSelect } from "@refinedev/antd";
import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";  
import { useState } from "react";
import { useList } from '@refinedev/core';

export const Pred = () => {
    const { formProps, saveButtonProps } = useForm({
        resource: "ml/predict",
        action: "create",
        redirect: false,
        successNotification: (data, values, resource) => {
            const qty = data?.data.data
            console.log(qty)
            setSuccessMessage(`${qty}`);
            return {
                message: "Predicted.",
                description: "Success",
                type: "success",
            };
        },
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [selectedProduct, setSelectedProduct] = useState({}); // Add this state to store the selected product

    const { selectProps: productSelectProps } = useSelect({
        resource: "product",
        optionLabel: "name",
        optionValue: "name",
        queryOptions: {
            // @ts-ignore
            select: (response) => response.data,
        },
    });

    const { data: products, isLoading } = useList({
        resource: "product",
    });

    const handleProductChange = (value) => {
        if (isLoading) return; // Wait for the products list to be loaded

        // @ts-ignore
        const selectedProduct = products?.data.data.find((product) => product.name === value);
        if (selectedProduct) {
            formProps.form.setFieldsValue({ code: selectedProduct.code });
        }
    };

    return (
    <div>
        <Form {...formProps} layout="vertical">
            <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: "Date is required" }]}
                getValueProps={(value) => ({ value: value ? dayjs(value) : null })}
                getValueFromEvent={(value) => value ? value.format("YYYY-MM-DD") : null}
            >
                <DatePicker />
            </Form.Item>  
                <Row gutter={24}>
                    <Col span={14}>
                        <Form.Item
                            label="Product"
                            name={["name"]}
                            rules={[{ required: true }]}
                        >
                            <Select
                                {...productSelectProps}
                                onSearch={undefined}
                                filterOption={true}
                                optionFilterProp="label"
                                onChange={handleProductChange} // Add this event handler
                            />
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item
                            label="Product Code"
                            name={["code"]}
                            rules={[{ required: true }]}
                        >
                            <Input  readOnly value={selectedProduct.code} />
                        </Form.Item>
                    </Col>
                </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        label="Customer Age"
                        name={["age"]}
                        rules={[{ required: true }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Payment Method"
                        name={["payment_method"]}
                        rules={[{ required: true }]}
                    >
                        <Select>
                            <Select.Option value="Cash">Cash</Select.Option>
                            <Select.Option value="Cashless">Cashless</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Button {...saveButtonProps}>Predict</Button>
        </Form>
            {successMessage && (
                <Card style={{margin: "16px"}}>
                    <p>Predicted Sale Quantity for this Product : </p>
                    {successMessage}
                </Card>
            )}
        </div>
    );
};