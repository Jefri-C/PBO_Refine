import { axiosInstance } from "@refinedev/simple-rest";

export const authProvider = {
  login: async ({ username, password }) => {
    try {
      const response = await axiosInstance.post('/login', { username, password });
      const token = response.data.token;
      localStorage.setItem('auth_token', token);

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

      return {
        success: true,
        redirectTo: '/',
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
  check: () => Promise.resolve(),
  onError: (error) => Promise.reject(error),
};
