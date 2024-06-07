import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, Button, Row, Col, notification } from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomMutation } from "@refinedev/core";


interface ISales {
    id: number;
    date: Date;
    payment_method: string;
    details :{
        product_id: number;
        sold_for: number;
        quantity: number;
    };
    total_amount: number;
}

export const SaleEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const salesId = Number(id);


    const { formProps, saveButtonProps, queryResult } = useForm<ISales>({
        resource: "sale",
        action: "edit",
        id: salesId,
        warnWhenUnsavedChanges: false,
    });

    const { mutate } = useCustomMutation();

    const API_URL = "https://pbouas.pythonanywhere.com/api"

    const handleOnFinish = (values: ISales) => {
        mutate(
            {
                url: `${API_URL}/sale/update`,
                method: "post",
                values,
            },
            {
                onSuccess: () => {
                    notification.success({
                        message: "Success",
                        description: "The sales has been edited successfully.",
                    });
                    navigate("/sales");
                },
            }
        );
    };

    const { selectProps: productSelectProps } = useSelect({
        resource: "product",
        optionLabel: "name",
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
        // @ts-ignore
        const salesDetailsValues = formProps.form.getFieldsValue().details;
        if (!salesDetailsValues) {
            return;
        }
        let total = 0;
        salesDetailsValues.forEach((detail) => {
            const quantity = detail.quantity || 0;
            const sellPrice = detail.sold_for || 0;
            total += quantity * sellPrice;
        });
        setGrandTotal(total);
        formProps.form.setFieldsValue({ total_amount: total });
    };


    useEffect(() => {
        calculateGrandTotal();
    }, [salesDetails]); 

    if (queryResult.isLoading) {
        return <div>Loading...</div>;
    }

    if (queryResult.isError) {
        return <div>Error loading product data.</div>;
    }

    // Extract the data from the queryResult
    // @ts-ignore
    const extractedData = queryResult.data?.data.data;
    const detailsData = extractedData.details;


    return (
        <Edit saveButtonProps={{ ...saveButtonProps, onClick: () => formProps.form.submit() }}>
            <Form {...formProps} layout="vertical" onFinish={handleOnFinish} onValuesChange={calculateGrandTotal}
                initialValues={{
                    id: extractedData.id,
                    date: extractedData.date,
                    payment_method: extractedData.payment_method,
                    total_amount: extractedData.total_amount,
                    age: extractedData.age,
                    gender: extractedData.gender,
                    details: detailsData.map((detail) => ({
                        product_id: detail.product_id,
                        sold_for: detail.sold_for,
                        quantity: detail.quantity,
                    })),
                }}>
                <Form.Item
                    label="ID"
                    name={["id"]}
                    rules={[{ required: true }]}
                    hidden
                >
                    <Input type="number" />
                </Form.Item>
                {/* <Form.Item
                    label="Date"
                    name={["date"]}
                    getValueProps={(value) => ({
                        value: value ? dayjs(value) : "",
                    })}
                >
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

                
                <Form.List name="details">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                <Row gutter={16} key={key}>
                                    <Col span={6}>
                                        <Form.Item
                                            {...restField}
                                            label="Product"
                                            name={[name, "product_id"]}
                                            fieldKey={[fieldKey, "product_id"]}
                                            rules={[{ required: true }]}
                                        >
                                            <Select {...productSelectProps} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item
                                            {...restField}
                                            label="Quantity"
                                            name={[name, "quantity"]}
                                            fieldKey={[fieldKey, "quantity"]}
                                            rules={[{ required: true }]}
                                        >
                                            <Input type="number" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item
                                            {...restField}
                                            label="Sell Price"
                                            name={[name, "sold_for"]}
                                            fieldKey={[fieldKey, "sold_for"]}
                                            rules={[{ required: true }]}
                                        >
                                            <Input type="number" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Button
                                            type="default"
                                            onClick={() => remove(name)}
                                            style={{ marginTop: '30px' }}
                                        >
                                            Remove
                                        </Button>
                                    </Col>
                                </Row>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} style={{ width: '100%', marginBottom: '20px' }}>
                                    Add Sales Details
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

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
        </Edit>
    );
};