import { Create, useForm, useSelect } from "@refinedev/antd";
import { Col, Form, Input, Row, Select } from "antd";
import { useNavigate } from "react-router-dom";

export const ProductCreate = () => {

    const navigate = useNavigate();
    const { formProps, saveButtonProps } = useForm({
        resource: "product/add",
        action: "create",
        redirect: false, // Disable automatic redirection
        onMutationSuccess: () => {
            navigate("/product"); // Manually redirect to the list page
        },
        successNotification: (data, values, resource) => {
            return {
                message: "The product has been created successfully.",
                description: "Success",
                type: "success",
            };
        },
    });

    const { selectProps: categorySelectProps } = useSelect({
        resource: "category",
        optionLabel: "name",
        optionValue: "id",
        queryOptions: {
            // @ts-ignore

            select: (response) => response.data, // Extract only the data array
        },
    });

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical" >
                <Form.Item
                    label={"Category"}
                    name={["category_id"]}
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
                    label={"Price"}
                    name={["price"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={"Stock"}
                    name={["stock"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Create>
    );
};