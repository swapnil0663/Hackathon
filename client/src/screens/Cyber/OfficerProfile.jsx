import React from 'react';
import { User } from 'lucide-react';

const OfficerProfile = () => {
  const assignedComplaints = [
    { id: 'CC-2024-001', user: 'John Smith', category: 'Phishing Scam', date: '2024-03-15', status: 'In Progress' },
    { id: 'CC-2024-005', user: 'Alice Johnson', category: 'Identity Theft', date: '2024-03-20', status: 'Pending' },
    { id: 'CC-2024-010', user: 'Bob Williams', category: 'Online Fraud', date: '2024-03-22', status: 'Resolved' },
    { id: 'CC-2024-012', user: 'Emily Davis', category: 'Cyberbullying', date: '2024-03-25', status: 'Closed' },
    { id: 'CC-2024-018', user: 'Michael Brown', category: 'Ransomware Attack', date: '2024-03-28', status: 'In Progress' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-500 text-white';
      case 'Pending': return 'bg-orange-500 text-white';
      case 'Resolved': return 'bg-green-500 text-white';
      case 'Closed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Officer Profile</h1>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Jane Doe</h2>
            <p className="text-gray-600">Officer ID: C-00123</p>
            <p className="text-gray-600">Cybercrime Investigator</p>
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
          <h3 className="text-lg font-semibold text-gray-900">Assigned Complaints</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Complaint ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date of Filing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assignedComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-blue-600">{complaint.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{complaint.user}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{complaint.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{complaint.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
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