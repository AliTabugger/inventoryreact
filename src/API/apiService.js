import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";
const token = localStorage.getItem("token") || null; // Get the token from local storage

const headers = {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

const apiService = {
  login: async (request) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, request);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  logout: async () => {
    const confirm = window.confirm("do you want to logout?");

    if (!confirm) {
      return;
    }

    try {
      const res = axios.post(`${API_BASE_URL}/logout`, {}, headers);
      localStorage.removeItem("token");
      console.log("logout successfully");
    } catch (error) {
      console.error(error);
    }
  },

  suppliers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/suppliers`, headers);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  categories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`, headers);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  storePart: async (request) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/store-part`, request, {
        headers: {
          Authorization: `Bearer ${token}`, // keep this
          // Do NOT set Content-Type manually!
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  updatePart: async (request, part) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/update-part/${part.id}`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`, // keep this
            // Do NOT set Content-Type manually!
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getParts: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/parts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data; // assuming response shape is { success: true, data: [...] }
    } catch (error) {
      console.error("Failed to fetch parts:", error);
      return [];
    }
  },
  deleteCategory: async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/deletecategory/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response; // assuming response shape is { success: true, data: [...] }
    } catch (error) {
      console.error("Failed to fetch parts:", error);
      return [];
    }
  },
  updateCategory: async (request, id) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/updatecategory/${id}`,
        request,
        headers
      );
      return response; // assuming response shape is { success: true, data: [...] }
    } catch (error) {
      console.error("Failed to fetch parts:", error);
      return [];
    }
  },
  storeCategory: async (request) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/storecategory`,
        request,
        headers
      );
      return response; // assuming response shape is { success: true, data: [...] }
    } catch (error) {
      console.error("Failed to fetch parts:", error);
      return [];
    }
  },

  deletePart: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/deletepart/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to delete part:", error);
      throw error;
    }
  },

  storeSupplier: async (request) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/store-supplier`,
        request,
        headers
      );
      return response; // assuming response shape is { success: true, data: [...] }
    } catch (error) {
      console.error("Failed to store supplier:", error);
      return [];
    }
  },

  updateSupplier: async (request, id) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/updatesupplier/${id}`,
        request,
        headers
      );
      return response; // assuming response shape is { success: true, data: [...] }
    } catch (error) {
      return error.response;
    }
  },
  deleteSupplier: async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/deletesupplier/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to delete supplier:", error);
      throw error;
    }
  },
};

export default apiService;
