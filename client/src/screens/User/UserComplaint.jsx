import { FileText, Search, Clock, Bell } from 'lucide-react';
import Layout from '../../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import tokenManager from '../../utils/sessionManager';

const UserComplaint = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = tokenManager.getUser();
    if (userData) {
      setUser(userData);
    }
  }, []);

  return (
    <Layout userType="user">
      <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
              Welcome, {user?.fullName} !
            </h1>
            <p className="text-gray-600 text-lg">Cyber Crime Complaint Management System</p>
          </div>
          <button 
            onClick={() => navigate('/register-complaint')}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Register New Complaint
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-4"></div>
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-br from-teal-100 to-teal-50 p-4 rounded-xl w-fit mb-6">
                <FileText className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Register New Complaint</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">Submit a detailed cyber crime complaint with supporting evidence and documentation.</p>
              <button 
                onClick={() => navigate('/register-complaint')}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-md"
              >
                Register Now
              </button>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-4 rounded-xl w-fit mb-6">
                <Search className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Track Complaint Status</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">Monitor real-time progress and updates of your submitted complaints.</p>
              <button 
                onClick={() => navigate('/user/complaints')}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-md"
              >
                Track Status
              </button>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-4 rounded-xl w-fit mb-6">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Complaint History</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">Review all past complaints and their complete resolution status.</p>
              <button 
                onClick={() => navigate('/complaint-history')}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-md"
              >
                View History
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserComplaint;