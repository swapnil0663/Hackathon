import { useState } from 'react';
import Layout from '../../components/Layout';

const Demo = () => {
  const [userType, setUserType] = useState('user');

  return (
    <Layout userType={userType}>
      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Component Demo</h1>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Switch User Type:
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setUserType('user')}
                className={`px-4 py-2 rounded-lg ${
                  userType === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                User View
              </button>
              <button
                onClick={() => setUserType('client')}
                className={`px-4 py-2 rounded-lg ${
                  userType === 'client' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Admin View
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {userType === 'user' ? 'User Dashboard' : 'Admin Dashboard'}
          </h2>
          <p className="text-gray-600">
            This is the main content area. The navbar shows "Complaint Track" on the left 
            with profile and logout buttons on the right. The sidebar changes based on user type.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Demo;