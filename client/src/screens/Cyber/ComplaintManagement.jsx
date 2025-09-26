import React, { useState, useEffect } from 'react';
import { Calendar, X, MapPin, Clock, User, FileText, MessageCircle, Play, Pause, Volume2, Image as ImageIcon, Filter, Search, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';
import MessagingModal from '../../components/MessagingModal';

const ComplaintManagement = () => {
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMessaging, setShowMessaging] = useState(false);
  const [messagingRecipient, setMessagingRecipient] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [audioRef, setAudioRef] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await api.getAllComplaints();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatStatus = (status) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesStatus = filterStatus === 'All Statuses' || formatStatus(complaint.status) === filterStatus;
    const matchesSearch = searchTerm === '' || 
      complaint.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (complaint.complaint_id || `CMP-${complaint.id}`).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const createAdminUser = async () => {
    const loadingToast = toast.loading('Creating admin user...');
    try {
      const result = await api.createAdmin();
      toast.success('Admin created successfully!\nUsername: admin\nPassword: admin@123', {
        id: loadingToast,
        duration: 6000,
      });
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error('Failed to create admin user', { id: loadingToast });
    }
  };

  if (complaints.length === 0 && !loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border p-12 text-center max-w-md w-full"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Complaints Found</h2>
            <p className="text-gray-600 mb-6">Please ensure you are logged in with admin role.</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={createAdminUser}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Create Admin User (admin / admin@123)
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  const openModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedComplaint(null);
  };

  const updateStatus = async (newStatus) => {
    const loadingToast = toast.loading('Updating status...');
    try {
      await api.updateComplaintStatus(selectedComplaint.id, newStatus);
      setComplaints(complaints.map(c => 
        c.id === selectedComplaint.id ? { ...c, status: newStatus } : c
      ));
      setSelectedComplaint({ ...selectedComplaint, status: newStatus });
      toast.success('Status updated successfully!', { id: loadingToast });
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status', { id: loadingToast });
    }
  };

  const getStatusColor = (status) => {
    const formattedStatus = formatStatus(status);
    switch (formattedStatus) {
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Submitted': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openMessaging = (complaint) => {
    setMessagingRecipient({
      id: complaint.user_id,
      name: complaint.user_name
    });
    setShowMessaging(true);
  };

  const playAudio = (audioPath, complaintId) => {
    if (playingAudio === complaintId) {
      audioRef?.pause();
      setPlayingAudio(null);
      setAudioRef(null);
    } else {
      if (audioRef) {
        audioRef.pause();
      }
      const audio = new Audio(`http://localhost:5000/uploads/${audioPath}`);
      audio.play();
      setPlayingAudio(complaintId);
      setAudioRef(audio);
      
      audio.onended = () => {
        setPlayingAudio(null);
        setAudioRef(null);
      };
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">Loading complaints...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 p-6 shadow-sm ml-64"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Complaint Management
            </h1>
            <p className="text-gray-600 mt-1">Manage and track cybercrime complaints</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{filteredComplaints.length}</p>
            <p className="text-sm text-gray-500">Total Complaints</p>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search complaints, users, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option>All Statuses</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Submitted</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Complaints Grid */}
      <div className="flex-1 overflow-y-auto p-6 ml-64">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredComplaints.map((complaint, index) => (
            <motion.div
              key={complaint.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group relative z-10"
            >
              {/* Card Header */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-blue-600">
                    {complaint.complaint_id || `CMP-${complaint.id}`}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(complaint.status)}`}>
                    {formatStatus(complaint.status)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 truncate">{complaint.title || 'Untitled Complaint'}</h3>
                <p className="text-sm text-gray-600 mt-1">{complaint.category}</p>
              </div>

              {/* User Info */}
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  {complaint.user_image ? (
                    <img 
                      src={`http://localhost:5000/uploads/${complaint.user_image}`}
                      alt={complaint.user_name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{complaint.user_name}</p>
                    <p className="text-xs text-gray-500">{formatDate(complaint.created_at)}</p>
                  </div>
                </div>

                {/* Evidence Indicators */}
                <div className="flex items-center gap-2 mb-4">
                  {complaint.evidence_files && (
                    <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                      <ImageIcon className="w-3 h-3" />
                      <span>Evidence</span>
                    </div>
                  )}
                  {complaint.voice_note && (
                    <button
                      onClick={() => playAudio(complaint.voice_note, complaint.id)}
                      className="flex items-center gap-1 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      {playingAudio === complaint.id ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      <span>Voice</span>
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openModal(complaint)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openMessaging(complaint)}
                    className="bg-green-600 text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Complaint Details Modal */}
      <AnimatePresence>
        {showModal && selectedComplaint && (
          <div className="fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl w-[calc(100vw-280px)] h-[calc(100vh-120px)] ml-64 mt-16 overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Complaint Details</h2>
                    <p className="text-blue-100 text-sm">{selectedComplaint.complaint_id || `CMP-${selectedComplaint.id}`}</p>
                  </div>
                  <button onClick={closeModal} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Complainant Info */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* User Profile */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                      <div className="text-center mb-4">
                        {selectedComplaint.user_image ? (
                          <img 
                            src={`http://localhost:5000/uploads/${selectedComplaint.user_image}`}
                            alt={selectedComplaint.user_name}
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mx-auto mb-4"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-12 h-12 text-white" />
                          </div>
                        )}
                        <h3 className="text-xl font-bold text-gray-900">{selectedComplaint.user_name}</h3>
                        <p className="text-gray-600">Complainant</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">User ID:</span>
                          <span className="text-sm font-medium">{selectedComplaint.user_id}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Submitted:</span>
                          <span className="text-sm font-medium">{formatDate(selectedComplaint.created_at)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(selectedComplaint.status)}`}>
                            {formatStatus(selectedComplaint.status)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Contact Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          closeModal();
                          openMessaging(selectedComplaint);
                        }}
                        className="w-full mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Contact User
                      </motion.button>
                    </div>
                    
                    {/* Voice Note */}
                    {selectedComplaint.voice_note && (
                      <div className="bg-white border-2 border-gray-100 rounded-2xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Volume2 className="w-4 h-4" />
                          Voice Note
                        </h4>
                        <div className="space-y-3">
                          <audio 
                            controls 
                            className="w-full"
                            src={`http://localhost:5000/uploads/${selectedComplaint.voice_note}`}
                          >
                            Your browser does not support the audio element.
                          </audio>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => playAudio(selectedComplaint.voice_note, selectedComplaint.id)}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            {playingAudio === selectedComplaint.id ? (
                              <><Pause className="w-4 h-4" /> Stop</>
                            ) : (
                              <><Play className="w-4 h-4" /> Play</>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Right Column - Complaint Details */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Complaint Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Category</label>
                          <p className="text-lg font-semibold text-gray-900">{selectedComplaint.category}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Priority</label>
                          <p className="text-lg font-semibold text-gray-900">{selectedComplaint.priority || 'Medium'}</p>
                        </div>
                        {selectedComplaint.location && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              Location
                            </label>
                            <p className="text-lg font-semibold text-gray-900">{selectedComplaint.location}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mb-6">
                        <label className="text-sm font-medium text-gray-500">Title</label>
                        <p className="text-lg font-semibold text-gray-900">{selectedComplaint.title || 'Untitled Complaint'}</p>
                      </div>
                      
                      <div className="mb-6">
                        <label className="text-sm font-medium text-gray-500">Description</label>
                        <div className="mt-2 p-4 bg-gray-50 rounded-xl">
                          <p className="text-gray-900 leading-relaxed">{selectedComplaint.description}</p>
                        </div>
                      </div>
                      
                      {/* Debug Info - Remove in production */}
                      <div className="mb-6 p-3 bg-yellow-50 rounded-xl text-xs">
                        <p><strong>Evidence Files:</strong> {selectedComplaint.evidence_files || 'None'}</p>
                        <p><strong>Voice Note:</strong> {selectedComplaint.voice_note || 'None'}</p>
                      </div>
                      
                      {/* Evidence Files */}
                      {selectedComplaint.evidence_files && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 flex items-center gap-1 mb-3">
                            <ImageIcon className="w-4 h-4" />
                            Evidence Files
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedComplaint.evidence_files.split(',').map((file, index) => {
                              const fileName = file.trim();
                              const fileUrl = `http://localhost:5000/uploads/${fileName}`;
                              const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
                              
                              return (
                                <div key={index} className="bg-gray-50 rounded-xl overflow-hidden">
                                  {isImage ? (
                                    <div>
                                      <img 
                                        src={fileUrl}
                                        alt={`Evidence ${index + 1}`}
                                        className="w-full h-48 object-cover"
                                      />
                                      <div className="p-3">
                                        <p className="text-sm text-gray-600 truncate">{fileName}</p>
                                        <a 
                                          href={fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm text-blue-600 hover:underline"
                                        >
                                          View Full Size
                                        </a>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="p-4 text-center">
                                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                      <p className="text-sm text-gray-600 truncate">{fileName}</p>
                                      <a 
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:underline"
                                      >
                                        Download File
                                      </a>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Status Update */}
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Update Status</h4>
                      <div className="flex gap-2 flex-wrap">
                        {['pending', 'in_progress', 'resolved'].map((status) => (
                          <motion.button
                            key={status}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateStatus(status)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                              selectedComplaint.status === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {formatStatus(status)}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Messaging Modal */}
      <MessagingModal 
        isOpen={showMessaging}
        onClose={() => setShowMessaging(false)}
        recipientId={messagingRecipient?.id}
        recipientName={messagingRecipient?.name}
      />
    </div>
  );
};

export default ComplaintManagement