import { useState, useEffect } from 'react';
import { Search, Eye, Calendar, CheckCircle, Clock } from 'lucide-react';
import Layout from '../../components/Layout';
import api from '../../services/api';

const ComplaintHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResolvedComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [complaints, searchTerm]);

  const fetchResolvedComplaints = async () => {
    try {
      setLoading(true);
      const data = await api.getComplaints();
      if (Array.isArray(data)) {
        const resolvedComplaints = data.filter(complaint => 
          complaint.status === 'resolved' || complaint.status === 'closed'
        );
        setComplaints(resolvedComplaints);
      } else {
        console.error('Invalid data format received:', data);
        setComplaints([]);
      }
    } catch (error) {
      console.error('Failed to fetch complaint history:', error);
      setComplaints([]);
      // Check if it's an authentication error
      if (error.message?.includes('401') || error.response?.status === 401) {
        console.log('User not authenticated, please login');
      }
    } finally {
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
    setFilteredComplaints(filtered);
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

  const getResolutionTime = (createdAt, resolvedAt) => {
    if (!resolvedAt) return 'N/A';
    const created = new Date(createdAt);
    const resolved = new Date(resolvedAt);
    const diffTime = Math.abs(resolved - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };

  return (
    <Layout userType="user">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Complaint History
            </h1>
            <p className="text-gray-600 text-lg">View all your resolved and closed cyber crime complaints</p>
          </div>
          <div className="text-right bg-green-50 p-6 rounded-xl border border-green-200">
            <div className="text-3xl font-bold text-green-600">{complaints.length}</div>
            <div className="text-sm text-green-700 font-medium">Resolved Cases</div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Resolved Complaints</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search resolved complaints by ID, title, or category..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {/* Complaints History */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400">Loading complaint history...</div>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
              <CheckCircle className="mx-auto mb-6 text-gray-400" size={64} />
              <div className="text-gray-600 text-xl font-semibold mb-2">No resolved complaints found</div>
              <p className="text-gray-500 text-sm">All resolved cases will appear here</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{complaint.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        complaint.status === 'resolved' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {complaint.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="text-blue-600 font-mono">
                        {complaint.complaint_id || `CMP${String(complaint.id).padStart(6, '0')}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        Submitted: {formatDate(complaint.created_at)}
                      </span>
                      {complaint.resolved_at && (
                        <span className="flex items-center gap-1">
                          <CheckCircle size={14} />
                          Resolved: {formatDate(complaint.resolved_at)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        Resolution Time: {getResolutionTime(complaint.created_at, complaint.resolved_at)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedComplaint(complaint)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Category:</span> {complaint.category}
                    {complaint.location && <span className="ml-4"><span className="font-medium">Location:</span> {complaint.location}</span>}
                  </div>
                  <p className="text-gray-700 text-sm line-clamp-2">{complaint.description}</p>
                </div>

                {complaint.resolution && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <div className="text-sm font-medium text-green-700 mb-1">Resolution:</div>
                    <p className="text-sm text-green-800">{complaint.resolution}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Complaint Detail Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedComplaint.title}</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-blue-600 font-mono">
                        {selectedComplaint.complaint_id || `CMP${String(selectedComplaint.id).padStart(6, '0')}`}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedComplaint.status === 'resolved' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {selectedComplaint.status.toUpperCase()}
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
                    <p className="text-gray-800 capitalize">{selectedComplaint.priority}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Location</label>
                    <p className="text-gray-800">{selectedComplaint.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Resolution Time</label>
                    <p className="text-gray-800">{getResolutionTime(selectedComplaint.created_at, selectedComplaint.resolved_at)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-gray-800 mt-1">{selectedComplaint.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Resolution</label>
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-1">
                    <p className="text-green-800">{selectedComplaint.resolution || 'Resolution details not available'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Submitted On</label>
                    <p className="text-gray-800">{formatDate(selectedComplaint.created_at)}</p>
                  </div>
                  {selectedComplaint.resolved_at && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Resolved On</label>
                      <p className="text-gray-800">{formatDate(selectedComplaint.resolved_at)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ComplaintHistory;