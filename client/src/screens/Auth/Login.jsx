import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthNavbar from '../../components/AuthNavbar';
import api from '../../services/api';
import tokenManager from '../../utils/sessionManager';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Admin login
    if (formData.emailOrPhone === 'admin' && formData.password === 'admin@123') {
      const adminToken = 'admin-jwt-token-' + Date.now();
      tokenManager.setToken(adminToken, { 
        fullName: 'Admin User', 
        email: 'admin@example.com', 
        role: 'admin' 
      });
      navigate('/admin-dashboard');
      return;
    }
    
    // User login
    if (formData.emailOrPhone === 'user' && formData.password === 'user@123') {
      const userToken = 'user-jwt-token-' + Date.now();
      tokenManager.setToken(userToken, { 
        fullName: 'Alex Johnson', 
        email: 'user@example.com', 
        role: 'user' 
      });
      navigate('/user-dashboard');
      return;
    }
    
    try {
      const result = await api.login(formData.emailOrPhone, formData.password);
      if (result.token) {
        tokenManager.setToken(result.token, result.user);
        const userRole = result.user?.role || 'user';
        navigate(userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard');
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4 pt-32">
      <AuthNavbar />
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-8 w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome </h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email or Phone
            </label>
            <input
              type="text"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleInputChange}
              placeholder="Enter your email or phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="text-left">
            <a href="#" className="text-blue-600 text-sm hover:text-blue-800 transition-colors">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-all duration-300"
          >
            Login
          </button>

          <div className="text-center text-gray-600 text-sm">OR</div>

          <button
            type="button"
            onClick={() => navigate('/register')}
            className="w-full border border-blue-500 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-all duration-300"
          >
            Register
          </button>

          <button
            type="button"
            className="w-full border border-cyan-500 text-cyan-600 py-2 px-4 rounded-md hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 font-medium transition-all duration-300"
          >
            Login with OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;