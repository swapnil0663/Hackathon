import { User, LogOut, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };
  
  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          Complaint Track
        </div>
        
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <button 
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <User size={20} className="text-gray-300" />
                <span className="text-gray-300">Profile</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-900/30 text-red-400 transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-blue-900/30 text-blue-400 transition-colors"
            >
              <LogIn size={20} />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;