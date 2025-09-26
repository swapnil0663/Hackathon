import { useState, useRef } from 'react';
import { MapPin, Upload, ChevronRight, Check, X, FileText, AlertCircle, Mic, Square, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
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
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);

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
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateStep = (stepId) => {
    const newErrors = {};
    
    if (stepId === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.category) newErrors.category = 'Category is required';
      if (formData.title.length > 100) newErrors.title = 'Title must be less than 100 characters';
      if (formData.description.length < 20) newErrors.description = 'Description must be at least 20 characters';
    }
    
    if (stepId === 2) {
      if (!formData.location.trim()) newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    
    for (const file of files) {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max size is 10MB.`);
        continue;
      }
      
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type.`);
        continue;
      }
      
      try {
        const uploadedFile = await api.uploadEvidence(file);
        setUploadedFiles(prev => [...prev, { ...uploadedFile, originalName: file.name }]);
        toast.success(`${file.name} uploaded successfully!`);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];
      
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      toast.error('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('Recording stopped');
    }
  };

  const playAudio = () => {
    if (audioBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const uploadVoiceNote = async () => {
    if (audioBlob) {
      try {
        const file = new File([audioBlob], 'voice-note.wav', { type: 'audio/wav' });
        const uploadedFile = await api.uploadEvidence(file);
        setUploadedFiles(prev => [...prev, { ...uploadedFile, originalName: 'Voice Note', type: 'audio' }]);
        setAudioBlob(null);
        toast.success('Voice note uploaded successfully!');
      } catch (error) {
        toast.error('Failed to upload voice note');
      }
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2)) {
      toast.error('Please fill all required fields correctly');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await api.createComplaint({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        priority: 'medium',
        evidence: uploadedFiles.map(file => file.filename)
      });
      
      if (result.complaint) {
        toast.success('Complaint submitted successfully!');
        navigate('/user-dashboard');
      }
    } catch (error) {
      toast.error('Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepComplete = (stepId) => {
    if (stepId === 1) return formData.title && formData.description && formData.category && Object.keys(errors).length === 0;
    if (stepId === 2) return formData.location && !errors.location;
    if (stepId === 3) return false; // Never show as complete until submitted
    return false;
  };

  return (
    <Layout userType="user">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Register New Complaint
            </h1>
            <p className="text-gray-600">Help us resolve your cybersecurity concerns</p>
          </motion.div>
        
          {/* Progress Steps */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
          >
            <div className="flex items-center justify-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shadow-lg ${
                        currentStep > step.id || isStepComplete(step.id)
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                          : currentStep === step.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {currentStep > step.id || isStepComplete(step.id) ? (
                        <Check size={18} />
                      ) : (
                        step.id
                      )}
                    </motion.div>
                    <div>
                      <span className={`text-sm font-semibold block ${
                        currentStep > step.id || isStepComplete(step.id)
                          ? 'text-green-600'
                          : currentStep === step.id
                          ? 'text-blue-600'
                          : 'text-gray-500'
                      }`}>
                        {step.title}
                      </span>
                      <span className="text-xs text-gray-400">Step {step.id}</span>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-6" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  Complaint Details
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title of Complaint *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Briefly summarize your complaint"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.title 
                          ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    />
                    {errors.title && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 flex items-center"
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.title}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Detailed Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Provide a detailed account of the issue, including dates, times, and involved parties."
                      rows={5}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                        errors.description 
                          ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    />
                    {errors.description && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 flex items-center"
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.description}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.category 
                          ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 flex items-center"
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.category}
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  Location Information
                </h2>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location of Incident *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Street address, City, State/Province"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.location 
                        ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  {errors.location && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 flex items-center"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.location}
                    </motion.p>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="mt-4 flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 hover:from-blue-100 hover:to-purple-100 rounded-lg transition-all border border-blue-200"
                  >
                    <MapPin size={16} />
                    <span>Auto-detect Current Location</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                  Upload Supporting Evidence
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Upload Evidence (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        accept=".jpg,.jpeg,.png,.gif,.pdf,.txt"
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                      >
                        Choose Files
                      </label>
                      <p className="text-gray-500 text-sm mt-3">
                        Upload images, documents, or other evidence<br/>
                        <span className="text-xs">Supported: JPG, PNG, GIF, PDF, TXT (Max 10MB each)</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Record Voice Note (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                      <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      
                      {!audioBlob ? (
                        <div className="space-y-3">
                          <button
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${
                              isRecording 
                                ? 'bg-red-600 hover:bg-red-700 text-white' 
                                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                            }`}
                          >
                            {isRecording ? (
                              <><Square size={16} className="inline mr-2" />Stop Recording</>
                            ) : (
                              <><Mic size={16} className="inline mr-2" />Start Recording</>
                            )}
                          </button>
                          {isRecording && (
                            <p className="text-red-600 text-sm animate-pulse">Recording in progress...</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex justify-center space-x-3">
                            <button
                              onClick={isPlaying ? pauseAudio : playAudio}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                            >
                              {isPlaying ? (
                                <><Pause size={16} className="inline mr-2" />Pause</>
                              ) : (
                                <><Play size={16} className="inline mr-2" />Play</>
                              )}
                            </button>
                            <button
                              onClick={uploadVoiceNote}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
                            >
                              <Upload size={16} className="inline mr-2" />Upload
                            </button>
                            <button
                              onClick={() => setAudioBlob(null)}
                              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all"
                            >
                              <X size={16} className="inline mr-2" />Discard
                            </button>
                          </div>
                          <p className="text-green-600 text-sm">Voice note recorded successfully!</p>
                        </div>
                      )}
                      
                      <audio ref={audioRef} className="hidden" />
                    </div>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Uploaded Files:</h3>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                          >
                            <div className="flex items-center space-x-3">
                              {file.type === 'audio' ? (
                                <Mic className="w-5 h-5 text-green-600" />
                              ) : (
                                <FileText className="w-5 h-5 text-blue-600" />
                              )}
                              <span className="text-sm font-medium text-gray-700">{file.originalName}</span>
                              {file.type === 'audio' && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Audio</span>
                              )}
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className="p-1 text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between mt-8"
          >
            <motion.button
              whileHover={{ scale: currentStep === 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentStep === 1 ? 1 : 0.95 }}
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg border border-gray-200'
              }`}
            >
              Previous
            </motion.button>
            
            {currentStep < 3 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg"
              >
                Next Step
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterComplaint;