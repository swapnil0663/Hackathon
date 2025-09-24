import tokenManager from '../utils/sessionManager';

const API_BASE_URL = 'http://localhost:5000/api';

const api = {
  // Auth endpoints
  login: async (emailOrPhone, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      return data;
    } catch (error) {
      console.error('API Login Error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      return data;
    } catch (error) {
      console.error('API Register Error:', error);
      throw error;
    }
  },

  logout: async () => {
    const token = tokenManager.getToken();
    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
    }
    tokenManager.clearToken();
  },

  // Complaint endpoints
  createComplaint: async (complaintData) => {
    const token = tokenManager.getToken();
    const response = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(complaintData)
    });
    return response.json();
  },

  getComplaints: async () => {
    const token = tokenManager.getToken();
    const response = await fetch(`${API_BASE_URL}/complaints`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  getComplaint: async (id) => {
    const token = tokenManager.getToken();
    const response = await fetch(`${API_BASE_URL}/complaints/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  getDashboardStats: async () => {
    const token = tokenManager.getToken();
    const response = await fetch(`${API_BASE_URL}/complaints/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  getAllComplaints: async () => {
    const token = tokenManager.getToken();
    const response = await fetch(`${API_BASE_URL}/complaints/admin/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch complaints');
    }
    return data;
  },

  createAdmin: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/create-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  },

  getAllUsers: async () => {
    const token = tokenManager.getToken();
    const response = await fetch(`${API_BASE_URL}/complaints/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch users');
    }
    return data;
  },

  updateComplaintStatus: async (id, status) => {
    const token = tokenManager.getToken();
    const response = await fetch(`${API_BASE_URL}/complaints/admin/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update status');
    }
    return data;
  }
};

export default api;