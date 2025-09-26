import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import api from '../../services/api';
import tokenManager from '../../utils/sessionManager';

const OfficerProfile = () => {
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = tokenManager.getUser();
    setUser(currentUser);
    fetchAssignedComplaints();
  }, []);

  const fetchAssignedComplaints = async () => {
    try {
      setLoading(true);
      const data = await api.getComplaints();
      setAssignedComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching assigned complaints:', error);
      setAssignedComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatStatus = (status) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getStatusColor = (status) => {
    const formattedStatus = formatStatus(status);
    switch (formattedStatus) {
      case 'In Progress': return 'bg-blue-500 text-white';
      case 'Pending': return 'bg-orange-500 text-white';
      case 'Resolved': return 'bg-green-500 text-white';
      case 'Submitted': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Officer Profile</h1>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.fullName || 'User'}</h2>
            <p className="text-gray-600">User ID: {user?.userId || 'N/A'}</p>
            <p className="text-gray-600">{user?.role === 'admin' ? 'Administrator' : 'User'}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Actions</h3>
          <div className="flex gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
              Update Password
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
              Update Contact Details
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">My Complaints</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Complaint ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date of Filing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assignedComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-blue-600">{complaint.complaint_id || `CMP-${complaint.id}`}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{complaint.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{complaint.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(complaint.created_at)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(complaint.status)}`}>
                      {formatStatus(complaint.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OfficerProfile;