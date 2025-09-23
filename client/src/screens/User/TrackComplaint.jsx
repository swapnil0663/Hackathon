import { useState, useEffect } from 'react';
import { Search, Eye } from 'lucide-react';
import Layout from '../../components/Layout';
import api from '../../services/api';

const TrackComplaint = () => {
  const [searchId, setSearchId] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await api.getComplaints();
        const formattedComplaints = data.map(complaint => ({
          id: `CT${complaint.id}`,
          title: complaint.title,
          date: new Date(complaint.created_at).toLocaleDateString(),
          status: complaint.status,
          statusColor: getStatusColor(complaint.status)
        }));
        setComplaints(formattedComplaints);
      } catch (error) {
        console.error('Failed to fetch complaints:', error);
      }
    };
    fetchComplaints();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-blue-500';
      case 'in_progress': return 'bg-orange-500';
      case 'resolved': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const timeline = [
    { status: 'Complaint Submitted', date: 'March 10, 10:30 AM', description: 'Your complaint has been successfully registered in our system.', active: true },
    { status: 'Under Review', date: 'March 10, 2:15 PM', description: 'Our team is currently reviewing the details of your complaint.', active: true },
    { status: 'Investigation Ongoing', date: 'March 11, 9:00 AM', description: 'The relevant department is actively investigating the issue. Further updates will be provided soon.', active: false },
    { status: 'Additional Information Requested', date: 'March 12, 11:45 AM', description: 'We require more details to proceed with the investigation. Please check your messages.', active: false },
    { status: 'Resolution Proposed', date: 'March 13, 3:30 PM', description: 'Our team has reviewed the case and is awaiting your confirmation.', active: false },
    { status: 'Complaint Resolved', date: 'March 14, 4:20 PM', description: 'Your complaint has been successfully resolved to your satisfaction.', active: false }
  ];

  return (
    <Layout userType="user">
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Track Complaint Status</h1>
        <p className="text-gray-300 mb-8">Monitor the progress of your complaints in real-time.</p>

        {/* Search Section */}
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Search Complaints</h2>
          <p className="text-gray-300 text-sm mb-4">Find complaints by ID or filter by status.</p>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Complaint ID"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
              Search
            </button>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>Received</option>
              <option>Under Review</option>
              <option>Investigation Ongoing</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* All Complaints */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4">All Complaints</h2>
            <p className="text-gray-300 text-sm mb-6">Overview of your submitted complaints.</p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-300 pb-2 border-b border-slate-600">
                <span>Complaint ID</span>
                <span>Title</span>
                <span>Submission Date</span>
                <span>Status</span>
              </div>
              
              {complaints.map((complaint) => (
                <div key={complaint.id} className="grid grid-cols-4 gap-4 text-sm text-gray-300 py-2">
                  <span className="text-blue-400">{complaint.id}</span>
                  <span>{complaint.title}</span>
                  <span>{complaint.date}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs text-white ${complaint.statusColor}`}>
                      {complaint.status}
                    </span>
                    <button className="text-blue-400 hover:text-blue-300">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Complaint Progress Timeline */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4">Complaint Progress Timeline</h2>
            
            <div className="space-y-6">
              {timeline.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`w-3 h-3 rounded-full mt-1 ${step.active ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${step.active ? 'text-blue-400' : 'text-gray-400'}`}>
                      {step.status}
                    </h3>
                    <p className="text-xs text-gray-400 mb-1">{step.date}</p>
                    <p className="text-sm text-gray-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-slate-700/30 rounded-lg text-center">
              <h3 className="text-white font-medium mb-2">Need Assistance?</h3>
              <p className="text-gray-300 text-sm mb-3">
                If you have further questions or require direct support, chat with an officer.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                Chat with Officer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrackComplaint;