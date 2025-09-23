import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 p-6 bg-white border-b border-gray-200">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors border border-gray-800 hover:border-indigo-200"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>
      </div>
    </nav>
  );
};

export default AuthNavbar;