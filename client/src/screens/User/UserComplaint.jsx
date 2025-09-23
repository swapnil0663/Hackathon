import { FileText, Search, Clock, Bell } from 'lucide-react';
import Layout from '../../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const UserComplaint = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  const notifications = [
    { id: 1, message: "Complaint #CT234 has been moved to 'Under Review'", time: "2 hours ago" },
    { id: 2, message: "Investigation for Complaint #CG678 is ongoing.", time: "1 day ago" },
    { id: 3, message: "Complaint #CN012 has been resolved. Check details.", time: "3 days ago" }
  ];

  return (
    <Layout userType="user">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome, {user?.fullName || 'Alex Johnson'}!
            </h1>
            <p className="text-gray-300">Your central hub for managing all complaints efficiently.</p>
          </div>
          <button 
            onClick={() => navigate('/register-complaint')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Register New Complaint
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <FileText className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Register New Complaint</h3>
              <p className="text-gray-300 text-sm mb-4">Submit a detailed complaint with supporting evidence.</p>
              <button 
                onClick={() => navigate('/register-complaint')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
              >
                Register Now
              </button>
            </div>
            
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <Search className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Track Complaint Status</h3>
              <p className="text-gray-300 text-sm mb-4">Monitor the progress and updates of your submitted complaints.</p>
              <button 
                onClick={() => navigate('/track-complaint')}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
              >
                Track Status
              </button>
            </div>
            
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <Clock className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Complaint History</h3>
              <p className="text-gray-300 text-sm mb-4">Review all your past complaints and their resolution status.</p>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors">
                View History
              </button>
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Recent Notifications</h2>
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-medium text-white mb-4">Your Latest Updates</h3>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg">
                  <Bell className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm">{notification.message}</p>
                  </div>
                  <span className="text-gray-400 text-xs">{notification.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserComplaint;