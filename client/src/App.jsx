import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './screens/Landing/Landing';
import Login from './screens/Auth/Login';
import SignUp from './screens/Auth/SignUp';
import Demo from './screens/Demo/Demo';
import UserComplaint from './screens/User/UserComplaint';
import RegisterComplaint from './screens/User/RegisterComplaint';
import TrackComplaint from './screens/User/TrackComplaint';
import Profile from './screens/User/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/user-dashboard" element={<UserComplaint />} />
        <Route path="/register-complaint" element={<RegisterComplaint />} />
        <Route path="/track-complaint" element={<TrackComplaint />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;