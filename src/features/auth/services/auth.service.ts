import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"; // Adjust as needed

export const authService = {
  loginWithMicrosoft: async (accessToken: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/microsoft`, {
        accessToken,
      });
      return response.data;
    } catch (error) {
      console.error("Error logging in with Microsoft:", error);
      throw error;
    }
  },
};
