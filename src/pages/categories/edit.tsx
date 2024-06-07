import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, notification } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomMutation } from "@refinedev/core";

interface ICategory {
  id: number;
  name: string;
}

export const CategoryEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);

  const { formProps, saveButtonProps, queryResult } = useForm<ICategory>({
    resource: "category",
    action: "edit",
    id: categoryId,
    warnWhenUnsavedChanges: false,
  });

  const API_URL = "https://pbouas.pythonanywhere.com/api"

  const { mutate } = useCustomMutation();

  const handleOnFinish = (values: ICategory) => {
    mutate(
      {
        url: `${API_URL}/category/update`,
        method: "post",
        values,
      },
      {
        onSuccess: () => {
          notification.success({
            message: "Success",
            description: "The category has been edited successfully.",
          });
          navigate("/categories");
        },
      }
    );
  };


  if (queryResult.isLoading) {
    return <div>Loading...</div>;
  }

  if (queryResult.isError) {
    return <div>Error loading category data.</div>;
  }

  // Extract the data from the queryResult
  // @ts-ignore
  const extractedData = queryResult.data?.data.data;

  return (
    <Edit saveButtonProps={{ ...saveButtonProps, onClick: () => formProps.form.submit() }}>
      <Form {...formProps} layout="vertical" initialValues={{ id: extractedData.id, name: extractedData.name }} onFinish={handleOnFinish}>
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
          label="Name"
          name="name"
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