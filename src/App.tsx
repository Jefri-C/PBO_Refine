import { Authenticated, GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ShoppingOutlined,
  DashboardOutlined,
  TagsOutlined,
  ProductOutlined,
  RobotOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";

import {
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  ThemedTitleV2,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./authProvider";
import { AppIcon } from "./components/app-icon";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "./pages/categories";
import {
  ProductCreate,
  ProductEdit,
  ProductList,
  ProductShow,
} from "./pages/products";
import {
  SaleCreate,
  SaleEdit,
  SaleList,
  SaleShow,
} from "./pages/sales";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";

import { DashboardPage } from "./pages/dashboard";
import { axiosInstance } from "@refinedev/simple-rest";
import { useState, useEffect } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <DevtoolsProvider>
    <BrowserRouter>
      <RefineKbarProvider>
        {/* <ColorModeContextProvider> */}
          <AntdApp>
            <Refine
              dataProvider={dataProvider("https://pbouas.pythonanywhere.com", axiosInstance)}
                // dataProvider={dataProvider("https://my-json-server.typicode.com/Jefri-C/Fake-REST-API")}
              notificationProvider={useNotificationProvider}
              // @ts-ignore
              authProvider={authProvider}
              routerProvider={routerBindings}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: {
                    label: "Dashboard",
                    icon: <DashboardOutlined />,
                  },
                },
                {
                  name: "category",
                  list: "/categories",
                  create: "/categories/create",
                  edit: "/categories/edit/:id",
                  show: "/categories/show/:id",
                  meta: {
                    canDelete: true,
                    label: "Categories",
                    icon: <TagsOutlined />,
                  },
                },
                {
                  name: "product",
                  list: "/product",
                  create: "/product/create",
                  edit: "/product/edit/:id",
                  show: "/product/show/:id",
                  meta: {
                    canDelete: true,
                    label: "Products",
                    icon: <ProductOutlined />,
                  },
                },
                {
                  name: "sale",
                  list: "/sales",
                  create: "/sales/create",
                  edit: "/sales/edit/:id",
                  show: "/sales/show/:id",
                  meta: {
                    canDelete: true,
                    icon: <ShoppingOutlined />,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "scLNlN-9gXoAJ-SUSLr9",
              }}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-inner"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <ThemedLayoutV2
                        Header={() => <Header sticky />}
                        Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                        Title={({ collapsed }) => (
                          <ThemedTitleV2
                            collapsed={collapsed}
                            text="TokoToko"
                            icon={<AppIcon />}
                          />
                        )}
                      >
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                    <Route index element={<DashboardPage />} />

                  <Route path="/categories">
                    <Route index element={<CategoryList />} />
                    <Route path="create" element={<CategoryCreate />} />
                    <Route path="edit/:id" element={<CategoryEdit />} />
                    <Route path="show/:id" element={<CategoryShow />} />
                  </Route>
                  <Route path="/product">
                    <Route index element={<ProductList />} />
                    <Route path="create" element={<ProductCreate />} />
                    <Route path="edit/:id" element={<ProductEdit />} />
                    <Route path="show/:id" element={<ProductShow />} />
                  </Route>
                  <Route path="/sales">
                    <Route index element={<SaleList />} />
                    <Route path="create" element={<SaleCreate />} />
                    <Route path="edit/:id" element={<SaleEdit />} />
                    <Route path="show/:id" element={<SaleShow />} />
                  </Route>
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-outer"
                      fallback={<Outlet />}
                    >
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                  />
                </Route>
              </Routes>
              
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
              <DevtoolsPanel />
            </Refine>
          </AntdApp>
        {/* </ColorModeContextProvider> */}
      </RefineKbarProvider>
    </BrowserRouter>
    </DevtoolsProvider>
  );
}

export default App;
