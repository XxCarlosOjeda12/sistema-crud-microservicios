
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/v1/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});


api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Servicios para Startups
export const startupsService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const response = await api.get(`/startups/read?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/startups/read/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/startups/create', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/startups/update/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/startups/delete/${id}`);
    return response.data;
  }
};

// Servicios para Technologies
export const technologiesService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const response = await api.get(`/technologies/read?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/technologies/read/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/technologies/create', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/technologies/update/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/technologies/delete/${id}`);
    return response.data;
  }
};

export default api;