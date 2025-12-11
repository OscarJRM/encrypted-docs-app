import axios from "axios";
import { getSession } from "next-auth/react";

const API_URL = "/backend-api";

export interface CreateDocumentDto {
  title: string;
  content: string;
  category?: string;
  doc_type?: string;
  pdf_password?: string;
}

export interface AddRecipientDto {
  recipientUserId: string;
  canWrite: boolean;
}

export const documentService = {
  create: async (data: CreateDocumentDto) => {
    const session = await getSession();
    const token = session?.user?.accessToken;
    
    if (!token) throw new Error("No access token found");

    const response = await axios.post(`${API_URL}/documents`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  addRecipient: async (documentId: string, data: AddRecipientDto) => {
    const session = await getSession();
    const token = session?.user?.accessToken;
    
    if (!token) throw new Error("No access token found");

    const response = await axios.post(`${API_URL}/documents/${documentId}/recipients`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  send: async (documentId: string) => {
    const session = await getSession();
    const token = session?.user?.accessToken;
    
    if (!token) throw new Error("No access token found");

    const response = await axios.post(`${API_URL}/documents/${documentId}/send`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
};
