import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthNavbar = () => {
  const navigate = useNavigate();

  return (
    <motion.nav 
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-20 p-6 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg"
    >
      <div className="flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 text-blue-600 hover:from-gray-100 hover:to-blue-100 transition-all duration-200 border border-blue-200 shadow-sm"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back to Home</span>
          </motion.button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CyberGuard
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Secure Authentication</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default AuthNavbar;