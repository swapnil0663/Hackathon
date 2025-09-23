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

  // Complaint endpoints
  createComplaint: async (complaintData) => {
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/complaints`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  getComplaint: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/complaints/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};

export default api;