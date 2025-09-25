import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, MapPin, Clock, User, FileText } from 'lucide-react';
import api from '../../services/api';

const ComplaintManagement = () => {
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await api.getAllComplaints();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setComplaints([]);
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

  const filteredComplaints = filterStatus === 'All Statuses' 
    ? complaints 
    : complaints.filter(complaint => 
        formatStatus(complaint.status) === filterStatus
      );

  const createAdminUser = async () => {
    try {
      const result = await api.createAdmin();
      alert(`Admin created: Username: admin, Password: admin@123`);
    } catch (error) {
      console.error('Error creating admin:', error);
    }
  };

  if (complaints.length === 0 && !loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Complaint Management</h1>
          <p className="text-gray-600">Overview of all cybercrime complaints</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <p className="text-gray-500 mb-4">No complaints found. Please ensure you are logged in with admin role.</p>
          <button 
            onClick={createAdminUser}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Create Admin User (admin / admin@123)
          </button>
        </div>
      </div>
    );
  }

  const openModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedComplaint(null);
  };

  const updateStatus = async (newStatus) => {
    try {
      await api.updateComplaintStatus(selectedComplaint.id, newStatus);
      setComplaints(complaints.map(c => 
        c.id === selectedComplaint.id ? { ...c, status: newStatus } : c
      ));
      setSelectedComplaint({ ...selectedComplaint, status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status) => {
    const formattedStatus = formatStatus(status);
    switch (formattedStatus) {
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Submitted': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading complaints...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Complaint Management</h1>
        <p className="text-gray-600">Overview of all cybercrime complaints</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filter by Status:</span>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option>All Statuses</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Submitted</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Date</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Complaint ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-blue-600">{complaint.complaint_id || `CMP-${complaint.id}`}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{complaint.user_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{complaint.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(complaint.created_at)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(complaint.status)}`}>
                      {formatStatus(complaint.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-600 cursor-pointer hover:underline" onClick={() => openModal(complaint)}>
                    View Details
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>

      {showModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Complaint Details</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Complaint ID</label>
                    <p className="text-lg font-semibold text-blue-600">{selectedComplaint.complaint_id || `CMP-${selectedComplaint.id}`}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Title</label>
                    <p className="text-gray-900">{selectedComplaint.title}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="text-gray-900">{selectedComplaint.category}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Priority</label>
                    <p className="text-gray-900 capitalize">{selectedComplaint.priority}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Complainant</label>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{selectedComplaint.user_name}</p>
                    </div>
                    <p className="text-sm text-gray-600">{selectedComplaint.user_email}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{selectedComplaint.location || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date Submitted</label>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{formatDate(selectedComplaint.created_at)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <select 
                      value={selectedComplaint.status}
                      onChange={(e) => updateStatus(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="submitted">Submitted</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description
                </label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedComplaint.description}</p>
                </div>
              </div>
              
              {selectedComplaint.resolution && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Resolution</label>
                  <div className="mt-2 p-4 bg-green-50 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedComplaint.resolution}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t flex justify-end">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintManagement;