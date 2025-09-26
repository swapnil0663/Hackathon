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

  register: async (userData, imageBlob = null) => {
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
      
      // Upload image if provided
      if (imageBlob && data.user) {
        try {
          await api.uploadUserImage(imageBlob, data.user.id);
        } catch (imageError) {
          console.error('Image upload failed:', imageError);
          // Don't fail registration if image upload fails
        }
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
    
    // Fetch user images for each complaint
    const complaintsWithImages = await Promise.all(
      data.map(async (complaint) => {
        try {
          if (complaint.user_id) {
            const userImage = await api.getUserImage(complaint.user_id);
            return { ...complaint, user_image: userImage?.image_path };
          }
          return complaint;
        } catch (error) {
          return complaint;
        }
      })
    );
    
    return complaintsWithImages;
  },

  createAdmin: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/create-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  },

  uploadUserImage: async (imageBlob, userId) => {
    const formData = new FormData();
    formData.append('image', imageBlob, 'user-photo.jpg');
    formData.append('userId', userId);
    
    const response = await fetch(`${API_BASE_URL}/upload/user-image`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload image');
    }
    return data;
  },

  getUserImage: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/upload/user-image/${userId}`);
    if (response.status === 404) {
      return null; // No image found
    }
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user image');
    }
    return data;
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
  },

  uploadEvidence: async (file) => {
    const formData = new FormData();
    formData.append('evidence', file);
    
    const response = await fetch(`${API_BASE_URL}/upload/evidence`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload evidence');
    }
    return data;
  }
};

export default api;