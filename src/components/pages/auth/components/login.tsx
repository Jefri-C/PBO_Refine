import React from "react";
import {
  LoginPageProps,
  LoginFormTypes,
  useLink,
  useRouterType,
  useActiveAuthProvider,
  useLogin,
  useTranslate,
  useRouterContext,
} from "@refinedev/core";
import { ThemedTitleV2 } from "@refinedev/antd";
import {
  bodyStyles,
  containerStyles,
  headStyles,
  layoutStyles,
  titleStyles,
} from "./styles";
import {
  Row,
  Col,
  Layout,
  Card,
  Typography,
  Form,
  Input,
  Button,
  Checkbox,
  CardProps,
  LayoutProps,
  Divider,
  FormProps,
  theme,
} from "antd";

type LoginProps = LoginPageProps<LayoutProps, CardProps, FormProps>;
/**
 * **refine** has a default login page form which is served on `/login` route when the `authProvider` configuration is provided.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/antd-auth-page/#login} for more details.
 */
export const LoginPage: React.FC<LoginProps> = ({
  providers,
  registerLink,
  forgotPasswordLink,
  rememberMe,
  contentProps,
  wrapperProps,
  renderContent,
  formProps,
  title,
  hideForm,
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm<LoginFormTypes>();
  const translate = useTranslate();
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

  const authProvider = useActiveAuthProvider();
  const { mutate: login, isLoading } = useLogin<LoginFormTypes>({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const PageTitle =
    title === false ? null : (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "32px",
          fontSize: "20px",
        }}
      >
        {title ?? <ThemedTitleV2 collapsed={false} />}
      </div>
    );

  const CardTitle = (
    <Typography.Title
      level={3}
      style={{
        color: token.colorPrimaryTextHover,
        ...titleStyles,
      }}
    >
      {translate("pages.login.title", "Sign in to your account")}
    </Typography.Title>
  );

  const renderProviders = () => {
    if (providers && providers.length > 0) {
      return (
        <>
          {providers.map((provider) => {
            return (
              <Button
                key={provider.name}
                type="default"
                block
                icon={provider.icon}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: "8px",
                }}
                onClick={() =>
                  login({
                    providerName: provider.name,
                  })
                }
              >
                {provider.label}
              </Button>
            );
          })}
          {!hideForm && (
            <Divider>
              <Typography.Text
                style={{
                  color: token.colorTextLabel,
                }}
              >
                {translate("pages.login.divider", "or")}
              </Typography.Text>
            </Divider>
          )}
        </>
      );
    }
    return null;
  };

  const handleSubmit = (values) => {
    // Custom logic for form submission, e.g., sending data to a different URL
    console.log("Form values:", values);
    // Example: Submit form data to a different URL
    fetch("https://pbouas.pythonanywhere.com/api/login", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        // Handle response
        console.log("Response:", response);
        if (response.ok) {
          // Redirect to dashboard upon successful login
          window.location.href = "/";
        } else {
          // Handle unsuccessful login
          console.error("Login failed.");
          // Additional error handling if needed
        }
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      });
  };


  const CardContent = (
    <Card
      title={CardTitle}
      headStyle={headStyles}
      bodyStyle={bodyStyles}
      style={{
        ...containerStyles,
        backgroundColor: token.colorBgElevated,
      }}
      {...(contentProps ?? {})}
    >
      {renderProviders()}
      {!hideForm && (
        <Form<LoginFormTypes>
          layout="vertical"
          form={form}
          onFinish={(values) => handleSubmit(values)}
          requiredMark={false}
          initialValues={{
            remember: false,
          }}
          {...formProps}
        >
          <Form.Item
            name="username"
            label={translate("pages.login.fields.username", "Username")}
            rules={[
              {
                required: true,
                message: translate(
                  "pages.login.errors.requiredUsername",
                  "Username is required"
                ),
              },
            ]}
          >
            <Input
              size="large"
              placeholder={translate("pages.login.fields.username", "Username")}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label={translate("pages.login.fields.password", "Password")}
            rules={[
              {
                required: true,
                message: translate(
                  "pages.login.errors.requiredPassword",
                  "Password is required"
                ),
              },
            ]}
          >
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="●●●●●●●●"
              size="large"
            />
          </Form.Item>
          {!hideForm && (
            <Form.Item>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={isLoading}
                block
              >
                {translate("pages.login.signin", "Sign in")}
              </Button>
            </Form.Item>
          )}
        </Form>
      )}
    </Card>
  );

  return (
    <Layout style={layoutStyles} {...(wrapperProps ?? {})}>
      <Row
        justify="center"
        align={hideForm ? "top" : "middle"}
        style={{
          padding: "16px 0",
          minHeight: "100dvh",
          paddingTop: hideForm ? "15dvh" : "16px",
        }}
      >
        <Col xs={22}>
          {renderContent ? (
            renderContent(CardContent, PageTitle)
          ) : (
            <>
              {PageTitle}
              {CardContent}
            </>
          )}
        </Col>
      </Row>
    </Layout>
  );
};