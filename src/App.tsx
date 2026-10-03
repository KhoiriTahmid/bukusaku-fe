import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import TransactionsPage from "@/pages/TransactionsPage";
import UsersPage from "@/pages/UsersPage";
import RolesPage from "@/pages/RolesPage";
import DashboardPage from "./pages/DashboardPage";
import CharacterMatchPage from "./pages/CharacterMatchPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<ProtectedRoute permission="TRANSACTIONS.LIST" />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route element={<ProtectedRoute permission="TRANSACTIONS.LIST" />}>
            <Route path="/transactions" element={<TransactionsPage />} />
          </Route>
          <Route element={<ProtectedRoute permission="USERS.LIST" />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>
          <Route element={<ProtectedRoute permission="ROLES.LIST" />}>
            <Route path="/roles" element={<RolesPage />} />
          </Route>
          <Route path="/character-match" element={<CharacterMatchPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
