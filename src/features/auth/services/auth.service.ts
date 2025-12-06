import axios from "axios";

const API_URL = "/backend-api";

export const authService = {
  login: async (cedula: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        cedula,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  forgotPassword: async (cedula: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        cedula,
      });
      return response.data;
    } catch (error) {
      console.error("Error requesting password reset:", error);
      throw error;
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  },
};
