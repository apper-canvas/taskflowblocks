import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const AlertTriangle = getIcon('AlertTriangle');

function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-[80vh]"
    >
      <div className="text-center p-8 max-w-md">
        <AlertTriangle className="w-20 h-20 mx-auto text-amber-500" />
        <h1 className="text-3xl font-bold mt-6 mb-2">Page Not Found</h1>
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary inline-block">
          Return to Dashboard
        </Link>
      </div>
    </motion.div>
  );
}

export default NotFound;