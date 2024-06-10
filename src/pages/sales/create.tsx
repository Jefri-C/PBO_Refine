import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, Button, Row, Col } from "antd";
import { useList, useMany } from "@refinedev/core";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export const SaleCreate = () => {

    const navigate = useNavigate();


    const { formProps, saveButtonProps } = useForm({
            resource: "sale/add",
            action: "create",
            redirect: false, // Disable automatic redirection
            onMutationSuccess: () => {
                navigate("/sales"); // Manually redirect to the list page
            },
            successNotification: (data, values, resource) => {
                return {
                    message: "The sale has been created successfully.",
                    description: "Success",
                    type: "success",
                };
            },
    });
    const { selectProps: productSelectProps } = useSelect({
        resource: "product",
        // @ts-ignore
        optionLabel: (item) => `${item.name} ${item.code}`,
        optionValue: "id",
        queryOptions: {
            // @ts-ignore
            select: (response) => response.data, // Extract only the data array
        },
    });



    const [salesDetails, setSalesDetails] = useState([{ key: Date.now() }]);
    const [grandTotal, setGrandTotal] = useState(0);

    const addSalesDetail = () => {
        setSalesDetails([...salesDetails, { key: Date.now() }]);
    };

    const removeSalesDetail = (key) => {
        setSalesDetails(salesDetails.filter(detail => detail.key !== key));
    };

    const calculateGrandTotal = () => {
        const total = salesDetails.reduce((acc, detail, index) => {
            const quantity = formProps.form.getFieldValue(["details", index, "quantity"]) || 0;
            const sellPrice = formProps.form.getFieldValue(["details", index, "sold_for"]) || 0;
            return acc + (quantity * sellPrice);
        }, 0);
        setGrandTotal(total);
        formProps.form.setFieldsValue({ total_amount: total });
    };

    useEffect(() => {
        calculateGrandTotal();
    }, [salesDetails]);

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical" onValuesChange={calculateGrandTotal}>
                {/* <Form.Item label="Date" name="date">
                    <DatePicker />
                </Form.Item> */}
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item label="Age Range" name="age">
                            <Select>
                                <Select.Option value="1">&lt; 20</Select.Option>
                                <Select.Option value="2">20-29</Select.Option>
                                <Select.Option value="3">30-39</Select.Option>
                                <Select.Option value="4">40-49</Select.Option>
                                <Select.Option value="5">50-59</Select.Option>
                                <Select.Option value="6">≥ 60</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Gender" name="gender">
                            <Select>
                                <Select.Option value="M">Male</Select.Option>
                                <Select.Option value="F">Female</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Payment Method" name="payment_method">
                            <Select>
                                <Select.Option value="Cash">Cash</Select.Option>
                                <Select.Option value="Cashless">Cashless</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                {salesDetails.map((detail, index) => (
                    <Row gutter={16} key={detail.key}>
                        <Col span={6}>
                            <Form.Item
                                label="Product"
                                name={["details", index, "product_id"]}
                                rules={[{ required: true }]}
                            >
                                <Select {...productSelectProps} onSearch={undefined}
                                    filterOption={true}
                                    optionFilterProp="label" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                label="Code"
                                name={["details", index, "product_code"]}
                                rules={[{ required: true }]}
                            >
                                <Input readOnly/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                label="Quantity"
                                name={["details", index, "quantity"]}
                                rules={[{ required: true }]}
                            >
                                <Input type="number" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                label="Sell Price"
                                name={["details", index, "sold_for"]}
                                rules={[{ required: true }]}
                            >
                                <Input type="number" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Button
                                type="default"
                                onClick={() => removeSalesDetail(detail.key)}
                                style={{ marginTop: '30px' }}
                            >
                                Remove
                            </Button>
                        </Col>
                    </Row>
                ))}

                <Button type="dashed" onClick={addSalesDetail} style={{ width: '100%', marginBottom: '20px' }}>
                    Add Sales Details
                </Button>

                <Form.Item
                    label={"Grand Total"}
                    name={["total_amount"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input readOnly />
                </Form.Item>
            </Form>
        </Create>
    );
};