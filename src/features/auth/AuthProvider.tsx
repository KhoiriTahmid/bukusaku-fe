import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { api, refreshSession, tokenStore } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";

export interface User {
  userId: string;
  email: string;
  name?: string;
  role: {
    name: string;
    permissions: Record<string, boolean>;
  };
}

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  can: (...permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthState>(null!);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on reload: refresh token -> new access token -> /auth/me
  useEffect(() => {
    if (!tokenStore.getRefresh()) {
      setLoading(false);
      return;
    }
    refreshSession()
      .then(() => api.get<User>("/auth/me"))
      .then(({ data }) => setUser(data))
      .catch(() => {
        tokenStore.clear();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    tokenStore.set(data.access_token, data.refresh_token);
    const { data: me } = await api.get<User>("/auth/me");
    setUser(me);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore: we clear the local session regardless
    } finally {
      tokenStore.clear();
      setUser(null);
      queryClient.clear();
    }
  };

  const can = (...permissions: string[]) => {
    const p = user?.role?.permissions;
    if (!p) return false;
    if (p["FULL_ACCESS"]) return true;
    return permissions.some((x) => Boolean(p[x]));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
}
