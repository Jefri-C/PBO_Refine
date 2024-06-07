import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Col, Form, Input, Row, Select, notification } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomMutation } from "@refinedev/core";

interface IProduct {
    id: number;
    name: string;
    price: number;
    stock: number;
    category_id: number;
}

export const ProductEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const productId = Number(id);

    const { formProps, saveButtonProps, queryResult } = useForm<IProduct>({
        resource: "product",
        action: "edit",
        id: productId,
        warnWhenUnsavedChanges: false,
    });

    const { mutate } = useCustomMutation();

    const API_URL = "https://pbouas.pythonanywhere.com/api"

    const handleOnFinish = (values: IProduct) => {
        mutate(
            {
                url: `${API_URL}/product/update`,
                method: "post",
                values,
            },
            {
                onSuccess: () => {
                    notification.success({
                        message: "Success",
                        description: "The product has been edited successfully.",
                    });
                    navigate("/product");
                },
            }
        );
    };

    const { selectProps: categorySelectProps } = useSelect({
        resource: "category",
        optionLabel: "name",
        optionValue: "id",
        queryOptions: {
            // @ts-ignore

            select: (response) => response.data, // Extract only the data array
        },
    });

    if (queryResult.isLoading) {
        return <div>Loading...</div>;
    }

    if (queryResult.isError) {
        return <div>Error loading product data.</div>;
    }

    // Extract the data from the queryResult
    // @ts-ignore

    const extractedData = queryResult.data?.data.data;

    return (
        <Edit saveButtonProps={{ ...saveButtonProps, onClick: () => formProps.form.submit() }}>
            <Form {...formProps} layout="vertical" initialValues={{ id: extractedData.id, name: extractedData.name, code: extractedData.code, price: extractedData.price, stock: extractedData.stock, category_id: extractedData.category_id }} onFinish={handleOnFinish}>
                <Form.Item
                    label="ID"
                    name="id"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    hidden
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Category"
                    name="category_id"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select {...categorySelectProps} />
                </Form.Item>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label={"Name"}
                            name={["name"]}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={"Code"}
                            name={["code"]}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    label="Price"
                    name="price"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Stock"
                    name="stock"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Edit>
    );
};