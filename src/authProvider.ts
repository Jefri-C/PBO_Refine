import { axiosInstance } from "@refinedev/simple-rest";

export const authProvider = {
  login: async ({ email, password }) => {
    // Implement your login logic here
    const response = await axiosInstance.post("/login", { email, password });
    localStorage.setItem("token", response.data.token);
    return Promise.resolve();
  },
  logout: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },
  checkError: (error) => {
    if (error.status === 401) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: () => {
    return localStorage.getItem("token") ? Promise.resolve() : Promise.reject();
  },
  getPermissions: () => Promise.resolve(),
  // Add the missing methods
  check: () => Promise.resolve(),
  onError: (error) => Promise.reject(error),
};