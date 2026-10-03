import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { useAuth } from "@/features/auth/AuthProvider";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const onFinish = async (v: { email: string; password: string }) => {
    try {
      setLoading(true);
      setError("");
      await login(v.email, v.password);
      navigate("/");
    } catch {
      setError("Incorrect email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--background)",
      }}
    >
      <Card
        style={{
          width: 360,
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <Typography.Title
          level={3}
          style={{ textAlign: "center", marginTop: 0, color: "var(--text)" }}
        >
          BukuSaku
        </Typography.Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, min: 6, message: "At least 6 characters" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          {error && (
            <Alert
              type="error"
              message={error}
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          <Button type="primary" htmlType="submit" block loading={loading}>
            Sign in
          </Button>
        </Form>
      </Card>
    </div>
  );
}
