import { useState, useEffect } from 'react';
import { Search, Eye, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../services/api';

const TrackComplaint = () => {
  const [searchId, setSearchId] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const data = await api.getComplaints();
        if (Array.isArray(data)) {
          const formattedComplaints = data.map(complaint => ({
            id: complaint.complaint_id || `CMP${String(complaint.id).padStart(6, '0')}`,
            originalId: complaint.id,
            title: complaint.title,
            date: new Date(complaint.created_at).toLocaleDateString(),
            status: complaint.status,
            statusColor: getStatusColor(complaint.status),
            category: complaint.category,
            priority: complaint.priority,
            location: complaint.location
          }));
          setComplaints(formattedComplaints);
        } else {
          console.error('Invalid data format received:', data);
          setComplaints([]);
        }
      } catch (error) {
        console.error('Failed to fetch complaints:', error);
        setComplaints([]);
        // Check if it's an authentication error
        if (error.message?.includes('401') || error.response?.status === 401) {
          // Redirect to login or show authentication error
          console.log('User not authenticated, please login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border border-gray-200';
      default: return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    }
  };



  return (
    <Layout userType="user">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Track Complaint Status</h1>
            <p className="text-gray-600">Monitor the progress of your complaints in real-time.</p>
          </div>
          <Link 
            to="/user/complaints" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <List size={16} />
            View All Complaints
          </Link>
        </div>

        {/* Search Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Search Complaints</h2>
          <p className="text-gray-600 text-sm mb-4">Find complaints by ID or filter by status.</p>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Complaint ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-md transition-colors">
              Search
            </button>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>Received</option>
              <option>Under Review</option>
              <option>Investigation Ongoing</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        {/* All Complaints */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">All Complaints</h2>
          <p className="text-gray-600 text-sm mb-6">Overview of your submitted complaints. Click "View Details" for progress timeline.</p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600 pb-2 border-b border-gray-200">
              <span>Complaint ID</span>
              <span>Title</span>
              <span>Submission Date</span>
              <span>Status</span>
            </div>
            
            {loading ? (
              <div className="text-center py-8 text-gray-600">Loading complaints...</div>
            ) : complaints.length === 0 ? (
              <div className="text-center py-8 text-gray-600">No complaints found. Create a complaint first.</div>
            ) : (
              complaints.map((complaint) => (
                <div key={complaint.originalId} className="grid grid-cols-4 gap-4 text-sm text-gray-700 py-3 hover:bg-gray-50 rounded px-2 transition-colors">
                  <span className="text-blue-600 font-mono">{complaint.id}</span>
                  <div>
                    <div className="font-medium">{complaint.title}</div>
                    <div className="text-xs text-gray-500">{complaint.category}</div>
                  </div>
                  <div>
                    <div>{complaint.date}</div>
                    {complaint.location && <div className="text-xs text-gray-500">{complaint.location}</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${complaint.statusColor}`}>
                      {complaint.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <Link to="/user/complaints" className="text-blue-600 hover:text-blue-800">
                      <Eye size={16} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrackComplaint;