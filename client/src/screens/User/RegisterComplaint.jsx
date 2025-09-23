import { useState } from 'react';
import { MapPin, Upload } from 'lucide-react';
import Layout from '../../components/Layout';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const RegisterComplaint = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: ''
  });

  const categories = [
    'Cybercrime',
    'Online Fraud',
    'Identity Theft',
    'Harassment',
    'Data Breach',
    'Other'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await api.createComplaint({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: 'medium'
      });
      if (result.complaint) {
        alert('Complaint submitted successfully!');
        navigate('/user-dashboard');
      }
    } catch (error) {
      console.error('Failed to submit complaint:', error);
    }
  };

  return (
    <Layout userType="user">
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Register New Complaint</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Complaint Details */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-6">Complaint Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title of Complaint
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Briefly summarize your complaint"
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Detailed Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed account of the issue, including dates, times, and involved parties."
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-6">Location Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location of Incident
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Street address, City, State/Province"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <button
                type="button"
                className="mt-3 flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <MapPin size={16} />
                <span>Auto-detect Current Location</span>
              </button>
            </div>
          </div>

          {/* Upload Supporting Evidence */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-6">Upload Supporting Evidence</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Evidence
              </label>
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Attach Files
                </button>
                <p className="text-gray-400 text-sm mt-2">
                  Upload images, documents, or other evidence (Max 10MB)
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium text-lg transition-colors"
          >
            Submit Complaint
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default RegisterComplaint;