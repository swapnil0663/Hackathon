import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="absolute top-0 left-0 right-0 z-10 p-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>
        
        <div className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          Complaint Track
        </div>
      </div>
    </nav>
  );
};

export default AuthNavbar;