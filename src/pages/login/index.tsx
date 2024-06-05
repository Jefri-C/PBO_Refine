import { AuthPage, ThemedTitleV2 } from "@refinedev/antd";
import { AppIcon } from "../../components/app-icon";
import { AuthPageV2 } from "../../components/pages/auth";

export const Login = () => {
  return (
    <AuthPageV2
      type="login"
      title={
        <ThemedTitleV2 collapsed={false} text="TokoToko" icon={<AppIcon />} />
      }
      formProps={{
        initialValues: { username: "admin", password: "admin" },
      }}
    />
  );
};
