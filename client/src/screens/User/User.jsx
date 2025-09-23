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
      case 'pending': return 'bg-yellow-500 text-yellow-900';
      case 'in_progress': return 'bg-blue-500 text-blue-900';
      case 'resolved': return 'bg-green-500 text-green-900';
      case 'closed': return 'bg-gray-500 text-gray-900';
      default: return 'bg-yellow-500 text-yellow-900';
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Complaints</h1>
            <p className="text-gray-300">View and track all your submitted complaints</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-400">{complaints.length}</div>
            <div className="text-sm text-gray-400">Total Complaints</div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Complaint ID, Title, or Category..."
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400">Loading complaints...</div>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
            <div className="text-gray-400">No complaints found</div>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{complaint.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {complaint.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="text-blue-400 font-mono">{complaint.complaint_id || `CMP${String(complaint.id).padStart(6, '0')}`}</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(complaint.created_at)}
                      </span>
                      {complaint.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {complaint.location}
                        </span>
                      )}
                      <span className={`flex items-center gap-1 ${getPriorityColor(complaint.priority)}`}>
                        <AlertCircle size={14} />
                        {complaint.priority} priority
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedComplaint(complaint)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-300 mb-2">
                    <span className="font-medium">Category:</span> {complaint.category}
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-2">{complaint.description}</p>
                </div>

                {complaint.resolution && (
                  <div className="bg-green-900/20 border border-green-700/50 rounded-md p-3">
                    <div className="text-sm font-medium text-green-400 mb-1">Resolution:</div>
                    <p className="text-sm text-green-300">{complaint.resolution}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Complaint Detail Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">{selectedComplaint.title}</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-blue-400 font-mono">{selectedComplaint.complaint_id || `CMP${String(selectedComplaint.id).padStart(6, '0')}`}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedComplaint.status)}`}>
                        {selectedComplaint.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Category</label>
                    <p className="text-white">{selectedComplaint.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Priority</label>
                    <p className={`capitalize ${getPriorityColor(selectedComplaint.priority)}`}>{selectedComplaint.priority}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Location</label>
                    <p className="text-white">{selectedComplaint.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Submitted</label>
                    <p className="text-white">{formatDate(selectedComplaint.created_at)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400">Description</label>
                  <p className="text-white mt-1">{selectedComplaint.description}</p>
                </div>

                {selectedComplaint.resolution && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Resolution</label>
                    <div className="bg-green-900/20 border border-green-700/50 rounded-md p-3 mt-1">
                      <p className="text-green-300">{selectedComplaint.resolution}</p>
                    </div>
                  </div>
                )}
                
                {/* Complaint Progress Timeline */}
                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-400 mb-4 block">Progress Timeline</label>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="space-y-4">
                      {getTimelineForStatus(selectedComplaint.status).map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                            step.active ? 'bg-blue-500' : step.completed ? 'bg-green-500' : 'bg-gray-500'
                          }`}></div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-medium ${
                              step.active ? 'text-blue-400' : step.completed ? 'text-green-400' : 'text-gray-400'
                            }`}>
                              {step.status}
                            </h4>
                            {step.date && <p className="text-xs text-gray-500 mt-1">{step.date}</p>}
                            <p className="text-xs text-gray-300 mt-1">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-3 bg-slate-600/30 rounded-md text-center">
                      <h4 className="text-white font-medium text-sm mb-2">Need Assistance?</h4>
                      <p className="text-gray-300 text-xs mb-3">
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