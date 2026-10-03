import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const REFRESH_KEY = "bukusaku_refresh_token";

export const api = axios.create({ baseURL: API_URL });

let accessToken: string | null = null;

export const tokenStore = {
  set(access: string, refresh: string) {
    accessToken = access;
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    accessToken = null;
    localStorage.removeItem(REFRESH_KEY);
  },
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
};

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// One refresh at a time. This matters because refresh tokens rotate:
// two parallel refreshes would invalidate each other.
let refreshPromise: Promise<string> | null = null;

export const refreshSession = (): Promise<string> => {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return Promise.reject(new Error("No refresh token"));

  refreshPromise ??= axios
    .post(
      `${API_URL}/auth/refresh`,
      {},
      { headers: { Authorization: `Bearer ${refreshToken}` } },
    )
    .then(({ data }) => {
      tokenStore.set(data.access_token, data.refresh_token);
      return data.access_token as string;
    })
    .finally(() => (refreshPromise = null));

  return refreshPromise;
};

// Only login and refresh are excluded. /auth/me and /auth/logout SHOULD trigger a refresh on 401.
const SKIP_REFRESH = ["/auth/login", "/auth/refresh"];

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const skip = SKIP_REFRESH.some((p) => original?.url?.includes(p));

    if (error.response?.status === 401 && !original._retry && !skip) {
      original._retry = true;
      try {
        const token = await refreshSession();
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch (e) {
        tokenStore.clear();
        window.location.href = "/login";
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  },
);
