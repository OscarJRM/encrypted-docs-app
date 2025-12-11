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

export interface Document {
  id: string;
  title: string;
  content: string;
  category?: string;
  doc_type?: string;
  created_at: string;
  status: string;
  sender?: {
    id: string;
    email: string;
    name: string;
  };
  recipients?: any[];
}

export const documentService = {
  // 1. Bandejas (Listados)
  getInbox: async () => {
    const session = await getSession();
    const token = session?.user?.accessToken;
    if (!token) throw new Error("No access token found");

    const response = await axios.get(`${API_URL}/documents/inbox`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getOutbox: async () => {
    const session = await getSession();
    const token = session?.user?.accessToken;
    if (!token) throw new Error("No access token found");

    const response = await axios.get(`${API_URL}/documents/outbox`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getDrafts: async () => {
    const session = await getSession();
    const token = session?.user?.accessToken;
    if (!token) throw new Error("No access token found");

    const response = await axios.get(`${API_URL}/documents/drafts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // 2. Acciones sobre Documentos
  create: async (data: CreateDocumentDto) => {
    const session = await getSession();
    const token = session?.user?.accessToken;
    if (!token) throw new Error("No access token found");

    const response = await axios.post(`${API_URL}/documents`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getById: async (id: string) => {
    const session = await getSession();
    const token = session?.user?.accessToken;
    if (!token) throw new Error("No access token found");

    const response = await axios.get(`${API_URL}/documents/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  update: async (id: string, data: Partial<CreateDocumentDto>) => {
    const session = await getSession();
    const token = session?.user?.accessToken;
    if (!token) throw new Error("No access token found");

    const response = await axios.patch(`${API_URL}/documents/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  send: async (documentId: string) => {
    const session = await getSession();
    const token = session?.user?.accessToken;
    if (!token) throw new Error("No access token found");

    const response = await axios.post(`${API_URL}/documents/${documentId}/send`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // 3. Destinatarios y Adjuntos
  addRecipient: async (documentId: string, data: AddRecipientDto) => {
    const session = await getSession();
    const token = session?.user?.accessToken;
    if (!token) throw new Error("No access token found");

    const response = await axios.post(`${API_URL}/documents/${documentId}/recipients`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  addAttachment: async (documentId: string, file: File) => {
    const session = await getSession();
    const token = session?.user?.accessToken;
    if (!token) throw new Error("No access token found");

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_URL}/documents/${documentId}/attachments`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // 4. Otras Acciones
  reply: async (originalDocId: string, data: CreateDocumentDto) => {
    const session = await getSession();
    const token = session?.user?.accessToken;
    if (!token) throw new Error("No access token found");

    const response = await axios.post(`${API_URL}/documents/${originalDocId}/reply`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  download: async (documentId: string) => {
    const session = await getSession();
    const token = session?.user?.accessToken;
    if (!token) throw new Error("No access token found");

    const response = await axios.get(`${API_URL}/documents/${documentId}/download`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob', // Important for downloading files
    });
    return response.data;
  }
};
