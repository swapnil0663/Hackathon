import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './screens/Landing/Landing';
import Login from './screens/Auth/Login';
import SignUp from './screens/Auth/SignUp';
import Demo from './screens/Demo/Demo';
import UserComplaint from './screens/User/UserComplaint';
import RegisterComplaint from './screens/User/RegisterComplaint';

import User from './screens/User/User';
import ComplaintHistory from './screens/User/ComplaintHistory';
import Profile from './screens/User/Profile';
import AdminLayout from './screens/Cyber/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';
import { MessagingProvider } from './components/GlobalMessaging';
import { NotificationProvider } from './components/GlobalNotifications';

function App() {
  return (
    <NotificationProvider>
      <MessagingProvider>
        <Router>
        <Toast />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        } />
        <Route path="/user-dashboard" element={
          <ProtectedRoute requiredRole="user">
            <UserComplaint />
          </ProtectedRoute>
        } />
        <Route path="/register-complaint" element={
          <ProtectedRoute requiredRole="user">
            <RegisterComplaint />
          </ProtectedRoute>
        } />

        <Route path="/user/complaints" element={
          <ProtectedRoute requiredRole="user">
            <User />
          </ProtectedRoute>
        } />
        <Route path="/complaint-history" element={
          <ProtectedRoute requiredRole="user">
            <ComplaintHistory />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute requiredRole="user">
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
        </Router>
      </MessagingProvider>
    </NotificationProvider>
  );
}

export default App;