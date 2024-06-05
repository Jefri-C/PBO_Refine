import { AuthPage, ThemedTitleV2 } from "@refinedev/antd";
import { AppIcon } from "../../components/app-icon";
import { Form, Input } from "antd";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      title={
        <ThemedTitleV2 collapsed={false} text="TokoToko" icon={<AppIcon />} />
      }
      formProps={{
        initialValues: { username: "admin", password: "admin" },
        onFinish: (values) => {
          // Handle login logic here
          console.log("Login values:", values);
        },
        children: (
          <>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password />
            </Form.Item>
          </>
        ),
      }}
    />
  );
};