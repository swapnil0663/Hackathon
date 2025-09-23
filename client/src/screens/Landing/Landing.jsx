import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, CheckCircle, Users, BarChart3, Clock, FileText, Eye, ArrowRight } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ complaints: 0, resolved: 0, users: 0 });

    useEffect(() => {
        // Animate counters
        const timer = setTimeout(() => {
            setStats({ complaints: 1247, resolved: 1120, users: 892 });
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-32 h-32 border border-blue-400 rounded-full animate-pulse"></div>
                    <div className="absolute top-40 right-32 w-24 h-24 border border-cyan-400 rounded-lg rotate-45 animate-bounce"></div>
                    <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
                    <Shield className="absolute top-1/4 right-1/4 w-20 h-20 text-blue-400 opacity-20 animate-pulse" />
                    <Lock className="absolute bottom-1/4 left-1/3 w-16 h-16 text-cyan-400 opacity-20 animate-bounce" />
                </div>

                <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
                    <div className="mb-8">
                        <Shield className="w-20 h-20 text-blue-400 mx-auto mb-6 animate-pulse" />
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Your Voice, Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Action</span>
                    </h1>
                    
                    <h2 className="text-2xl md:text-3xl font-semibold text-blue-300 mb-8">
                        Smart Complaint Tracking System
                    </h2>
                    
                    <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Register complaints in seconds. Track every step with full transparency. 
                        Faster, smarter, and citizen-friendly.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <button 
                            onClick={() => navigate('/login')}
                            className="group bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
                        >
                            Register Complaint
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        
                        <button 
                            onClick={() => navigate('/login')}
                            className="group border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                        >
                            Admin Login
                            <Shield className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 px-6 bg-slate-800/50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-white mb-16">
                        How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Works</span>
                    </h2>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <FileText className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-4">Submit</h3>
                            <p className="text-gray-300 text-lg">Register complaint with evidence in just a few clicks</p>
                            <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mt-6 rounded"></div>
                        </div>
                        
                        <div className="text-center group">
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Eye className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-4">Track</h3>
                            <p className="text-gray-300 text-lg">Get real-time updates & notifications on progress</p>
                            <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mt-6 rounded"></div>
                        </div>
                        
                        <div className="text-center group">
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-4">Resolve</h3>
                            <p className="text-gray-300 text-lg">Transparent closure with feedback and resolution</p>
                            <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mt-6 rounded"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Highlight */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-white mb-16">
                        Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Features</span>
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="flex items-start gap-4 p-6 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors duration-300">
                            <Clock className="w-8 h-8 text-blue-400 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Real-Time Status Updates</h3>
                                <p className="text-gray-300">Track your complaint status instantly with live notifications</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-6 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors duration-300">
                            <FileText className="w-8 h-8 text-blue-400 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Easy Complaint Submission</h3>
                                <p className="text-gray-300">Simple, intuitive interface for quick complaint registration</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-6 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors duration-300">
                            <Shield className="w-8 h-8 text-blue-400 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Evidence Upload</h3>
                                <p className="text-gray-300">Upload photos, PDFs, screenshots as supporting evidence</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-6 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors duration-300">
                            <Eye className="w-8 h-8 text-blue-400 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Transparency Dashboard</h3>
                                <p className="text-gray-300">Complete visibility for both users and administrators</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-6 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors duration-300 md:col-span-2">
                            <BarChart3 className="w-8 h-8 text-blue-400 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Data-driven Insights</h3>
                                <p className="text-gray-300">AI-powered analytics for faster resolution and better decision making</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* User & Admin Preview */}
            <section className="py-20 px-6 bg-slate-800/50">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-8">
                        For Citizens & For <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Cyber Crime Officers</span>
                    </h2>
                    <p className="text-xl text-gray-300 mb-16">One Platform, Two Experiences</p>
                    
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-8 rounded-xl">
                            <Users className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                            <h3 className="text-2xl font-semibold text-white mb-4">Citizen Portal</h3>
                            <p className="text-gray-300 mb-6">Easy-to-use interface for complaint submission and tracking</p>
                            <div className="bg-slate-600 h-32 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400">User Dashboard Preview</span>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-8 rounded-xl">
                            <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                            <h3 className="text-2xl font-semibold text-white mb-4">Admin Portal</h3>
                            <p className="text-gray-300 mb-6">Comprehensive management system for cyber crime officers</p>
                            <div className="bg-slate-600 h-32 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400">Admin Dashboard Preview</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Security & Transparency */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-16">
                        Security & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Trust</span>
                    </h2>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">100% Secure</h3>
                            <p className="text-gray-300">Your data is protected with enterprise-grade security</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">End-to-End Encryption</h3>
                            <p className="text-gray-300">All communications are encrypted and secure</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">OTP Authentication</h3>
                            <p className="text-gray-300">Secure login with one-time password verification</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            <section className="py-20 px-6 bg-slate-800/50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-16">
                        Making an <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Impact</span>
                    </h2>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-blue-400 mb-2">
                                {stats.complaints.toLocaleString()}
                            </div>
                            <p className="text-xl text-white font-semibold mb-2">Complaints Processed</p>
                            <p className="text-gray-300">90% Faster Tracking</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="text-5xl font-bold text-cyan-400 mb-2">
                                {stats.resolved.toLocaleString()}
                            </div>
                            <p className="text-xl text-white font-semibold mb-2">Cases Resolved</p>
                            <p className="text-gray-300">5x More Transparency</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="text-5xl font-bold text-blue-400 mb-2">
                                {stats.users.toLocaleString()}
                            </div>
                            <p className="text-xl text-white font-semibold mb-2">Active Users</p>
                            <p className="text-gray-300">AI-Powered Analytics</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-12 rounded-2xl">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Be heard. Be secure. Track your complaint today.
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Join thousands of citizens who trust our platform for transparent complaint resolution
                        </p>
                        <button className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 rounded-lg font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                            Start Now
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 bg-slate-900 border-t border-slate-700">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <Shield className="w-8 h-8 text-blue-400" />
                            <span className="text-xl font-bold text-white">Smart Complaint System</span>
                        </div>
                        
                        <div className="flex gap-8 mb-4 md:mb-0">
                            <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
                            <a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
                            <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
                        </div>
                    </div>
                    
                    <div className="border-t border-slate-700 mt-8 pt-8 text-center">
                        <p className="text-gray-400">
                            Built for Hackathon 2025 — Tech for a Safer Tomorrow
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}