import { axiosInstance } from "@refinedev/simple-rest";

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authProvider = {
  login: async ({ username, password }) => {
    try {
      const response = await axiosInstance.post('/login', { username, password });
      const token = response.data.token;
      // Persist the token using useLocalStorage
      localStorage.setItem('auth_token', token);
      return {
        success: true,
        redirectTo: '/dashboard',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Invalid credentials',
      };
    }
  },
  logout: () => {
    localStorage.removeItem("auth_token");
    return Promise.resolve();
  },
  checkError: (error) => {
    if (error.status === 401) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: () => {
    return localStorage.getItem("auth_token") ? Promise.resolve() : Promise.reject();
  },
  getPermissions: () => Promise.resolve(),
  // Add the missing methods
  check: () => Promise.resolve(),
  onError: (error) => Promise.reject(error),
};