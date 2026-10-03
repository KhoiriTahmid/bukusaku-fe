import { Navigate, Outlet } from "react-router-dom";
import { Result, Spin } from "antd";
import { useAuth } from "./AuthProvider";

export function ProtectedRoute({ permission }: { permission?: string }) {
  const { user, loading, can } = useAuth();

  if (loading) return <Spin fullscreen tip="Loading..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (permission && !can(permission))
    return (
      <Result
        status="403"
        title="403"
        subTitle="You don't have access to this page."
      />
    );

  return <Outlet />;
}
