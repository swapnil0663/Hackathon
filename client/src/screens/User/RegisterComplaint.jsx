import { useState } from 'react';
import { MapPin, Upload, ChevronRight, Check } from 'lucide-react';
import Layout from '../../components/Layout';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const RegisterComplaint = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: ''
  });

  const steps = [
    { id: 1, title: 'Complaint Details' },
    { id: 2, title: 'Location Information' },
    { id: 3, title: 'Upload Supporting Evidence' }
  ];

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

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const result = await api.createComplaint({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
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

  const isStepComplete = (stepId) => {
    if (stepId === 1) return formData.title && formData.description && formData.category;
    if (stepId === 2) return formData.location;
    return false;
  };

  return (
    <Layout userType="user">
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Register New Complaint</h1>
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep > step.id || isStepComplete(step.id)
                      ? 'bg-green-600 text-white'
                      : currentStep === step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {currentStep > step.id || isStepComplete(step.id) ? (
                      <Check size={16} />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    currentStep > step.id || isStepComplete(step.id)
                      ? 'text-green-600'
                      : currentStep === step.id
                      ? 'text-blue-600'
                      : 'text-gray-600'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-500 ml-4" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-8">
          {/* Step Content */}
          {currentStep === 1 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Complaint Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title of Complaint
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Briefly summarize your complaint"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide a detailed account of the issue, including dates, times, and involved parties."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Location Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location of Incident
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Street address, City, State/Province"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <button
                  type="button"
                  className="mt-3 flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <MapPin size={16} />
                  <span>Auto-detect Current Location</span>
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Upload Supporting Evidence</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Evidence
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Attach Files
                  </button>
                  <p className="text-gray-500 text-sm mt-2">
                    Upload images, documents, or other evidence (Max 10MB)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              Previous
            </button>
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Submit Complaint
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterComplaint;