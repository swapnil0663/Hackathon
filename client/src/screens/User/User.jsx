import { useState, useEffect } from 'react';
import { Search, Eye, Filter, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../services/api';

const User = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [complaints, searchTerm, statusFilter]);

  const fetchComplaints = async () => {
    try {
      const data = await api.getComplaints();
      setComplaints(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    let filtered = complaints;

    if (searchTerm) {
      filtered = filtered.filter(complaint => 
        complaint.complaint_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.status === statusFilter);
    }

    setFilteredComplaints(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border border-gray-200';
      default: return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-yellow-400';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimelineForStatus = (status) => {
    const baseTimeline = [
      { status: 'Complaint Submitted', description: 'Your complaint has been successfully registered in our system.', completed: true },
      { status: 'Under Review', description: 'Our team is currently reviewing the details of your complaint.', completed: false },
      { status: 'Investigation Ongoing', description: 'The relevant department is actively investigating the issue.', completed: false },
      { status: 'Resolution Proposed', description: 'Our team has reviewed the case and proposed a solution.', completed: false },
      { status: 'Complaint Resolved', description: 'Your complaint has been successfully resolved.', completed: false }
    ];

    switch (status) {
      case 'pending':
        baseTimeline[0].completed = true;
        baseTimeline[1].active = true;
        break;
      case 'in_progress':
        baseTimeline[0].completed = true;
        baseTimeline[1].completed = true;
        baseTimeline[2].active = true;
        break;
      case 'resolved':
        baseTimeline.forEach((step, index) => {
          if (index < 4) step.completed = true;
        });
        baseTimeline[4].active = true;
        break;
      case 'closed':
        baseTimeline.forEach(step => step.completed = true);
        break;
    }

    return baseTimeline;
  };

  return (
    <Layout userType="user">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              My Complaints
            </h1>
            <p className="text-gray-600 text-lg">Monitor the progress of your complaints in real-time</p>
          </div>
          <Link to="/register-complaint" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            View All Complaints
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Complaints</h2>
          <p className="text-gray-600 mb-6">Find complaints by ID or filter by status.</p>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter Complaint ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Search
            </button>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Complaints Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">All Complaints</h2>
            <p className="text-gray-600 mt-1">Overview of your submitted complaints. Click "View Details" for progress timeline.</p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-600">Loading complaints...</div>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-500 text-lg mb-2">No complaints found. Create a complaint first</div>
            </div>
          ) : (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-gray-600 font-medium">Complaint ID</th>
                      <th className="text-left py-3 text-gray-600 font-medium">Title</th>
                      <th className="text-left py-3 text-gray-600 font-medium">Submission Date</th>
                      <th className="text-left py-3 text-gray-600 font-medium">Status</th>
                      <th className="text-left py-3 text-gray-600 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.map((complaint) => (
                      <tr key={complaint.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 text-gray-800 font-mono">{complaint.complaint_id || `CMP${String(complaint.id).padStart(6, '0')}`}</td>
                        <td className="py-4 text-gray-800">{complaint.title}</td>
                        <td className="py-4 text-gray-600">{formatDate(complaint.created_at)}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                            {complaint.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => setSelectedComplaint(complaint)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Complaint Detail Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedComplaint.title}</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-blue-600 font-mono">{selectedComplaint.complaint_id || `CMP${String(selectedComplaint.id).padStart(6, '0')}`}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedComplaint.status)}`}>
                        {selectedComplaint.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Category</label>
                    <p className="text-gray-800">{selectedComplaint.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Priority</label>
                    <p className="capitalize text-gray-800">{selectedComplaint.priority}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Location</label>
                    <p className="text-gray-800">{selectedComplaint.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Submitted</label>
                    <p className="text-gray-800">{formatDate(selectedComplaint.created_at)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-gray-800 mt-1">{selectedComplaint.description}</p>
                </div>

                {selectedComplaint.resolution && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Resolution</label>
                    <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-1">
                      <p className="text-green-800">{selectedComplaint.resolution}</p>
                    </div>
                  </div>
                )}
                
                {/* Complaint Progress Timeline */}
                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-600 mb-4 block">Progress Timeline</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-4">
                      {getTimelineForStatus(selectedComplaint.status).map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                            step.active ? 'bg-blue-500' : step.completed ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-medium ${
                              step.active ? 'text-blue-600' : step.completed ? 'text-green-600' : 'text-gray-500'
                            }`}>
                              {step.status}
                            </h4>
                            {step.date && <p className="text-xs text-gray-500 mt-1">{step.date}</p>}
                            <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-3 bg-white border border-gray-200 rounded-md text-center">
                      <h4 className="text-gray-800 font-medium text-sm mb-2">Need Assistance?</h4>
                      <p className="text-gray-600 text-xs mb-3">
                        If you have questions about your complaint progress, contact support.
                      </p>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs transition-colors">
                        Contact Support
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default User;