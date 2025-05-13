import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import getIcon from '../utils/iconUtils';

// Declare icons at the top
const HomeIcon = getIcon('Home');
const FrownIcon = getIcon('Frown');

function NotFound() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center"
    >
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
            <FrownIcon className="w-12 h-12 text-surface-400" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        
        <Link 
          to="/"
          className="btn btn-primary inline-flex items-center justify-center gap-2"
        >
          <HomeIcon className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
}

export default NotFound;