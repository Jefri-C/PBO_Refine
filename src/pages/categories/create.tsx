import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
import { useNavigate } from "react-router-dom";

export const CategoryCreate = () => {
  const navigate = useNavigate();

  const { formProps, saveButtonProps } = useForm({
    resource: "category/add",
    action: "create",
    redirect: false, // Disable automatic redirection
    onMutationSuccess: () => {
      navigate("/categories"); // Manually redirect to the list page
    },
    successNotification: (data, values, resource) => {
      return {
        message: "The category has been created successfully.",
        description: "Success",
        type: "success",
      };
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Name"
          name={["name"]}
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