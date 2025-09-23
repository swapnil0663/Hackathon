import React, { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';

const ComplaintManagement = () => {
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  
  const complaints = [
    { id: 'CCM-001-2024', user: 'Alice Johnson', category: 'Phishing Scam', date: '2024-03-15', status: 'In Progress' },
    { id: 'CCM-002-2024', user: 'Bob Williams', category: 'Identity Theft', date: '2024-03-10', status: 'Pending' },
    { id: 'CCM-003-2024', user: 'Carol Davis', category: 'Cyberbullying', date: '2024-03-05', status: 'Resolved' },
    { id: 'CCM-004-2024', user: 'David Green', category: 'Malware Infection', date: '2024-02-28', status: 'In Progress' },
    { id: 'CCM-005-2024', user: 'Eve White', category: 'Data Breach', date: '2024-02-20', status: 'Submitted' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Submitted': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />
            New Complaint
          </button>
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
              {complaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-blue-600">{complaint.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{complaint.user}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{complaint.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{complaint.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-600 cursor-pointer hover:underline">
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
    </div>
  );
};

export default ComplaintManagement;