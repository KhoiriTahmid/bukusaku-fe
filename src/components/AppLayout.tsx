import { useState } from "react";
import { Button, Layout, Menu, Space, Typography } from "antd";
import {
  SafetyCertificateOutlined,
  SwapOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MailOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";

const { Sider, Header, Content } = Layout;

const NAV = [
  {
    key: "/dashboard",
    icon: <MailOutlined />,
    label: "Dashboard",
    permission: "TRANSACTIONS.LIST",
  },
  {
    key: "/transactions",
    icon: <SwapOutlined />,
    label: "Transactions",
    permission: "TRANSACTIONS.LIST",
  },
  {
    key: "/users",
    icon: <TeamOutlined />,
    label: "Users",
    permission: "USERS.LIST",
  },
  {
    key: "/roles",
    icon: <SafetyCertificateOutlined />,
    label: "Roles",
    permission: "ROLES.LIST",
  },
  {
    key: "/character-match",
    icon: <ExperimentOutlined />,
    label: "Character Match",
  },
];

export default function AppLayout() {
  const { user, logout, can } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const items = NAV.filter((n) => !n.permission || can(n.permission)).map(
    ({ permission, ...rest }) => rest,
  );

  return (
    <Layout style={{ minHeight: "100vh", background: "var(--background)" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={0}
        trigger={null}
        style={{ background: "var(--text)" }}
      >
        <Typography.Title
          level={4}
          style={{
            color: "var(--surface)",
            textAlign: "center",
            margin: "16px 0",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {collapsed ? "BS" : "BukuSaku"}
        </Typography.Title>

        <Menu
          theme="dark"
          selectedKeys={[pathname]}
          items={items}
          onClick={({ key }) => navigate(key)}
          style={{ background: "var(--text)" }}
        />
      </Sider>
      <Layout style={{ minHeight: "100vh", background: "var(--background)" }}>
        <Header
          style={{
            background: "var(--surface)",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 24px",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />

          <Space>
            <span style={{ color: "var(--text)" }}>
              {user?.name ?? user?.email}
            </span>
            <Button onClick={logout}>Sign out</Button>
          </Space>
        </Header>

        <Content style={{ padding: 24, background: "var(--background)" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
