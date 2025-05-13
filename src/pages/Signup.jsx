import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useContext } from 'react';
import { AuthContext } from '../App';
import { motion } from 'framer-motion';

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isInitialized } = useContext(AuthContext);
  const { isAuthenticated } = useSelector(state => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isInitialized) {
      // Show signup UI in this component
      const { ApperUI } = window.ApperSDK;
      ApperUI.showSignup("#authentication");
    }
  }, [isInitialized]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900"
    >
      <div className="w-full max-w-md space-y-8 p-6 bg-white dark:bg-surface-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">TaskFlow</h1>
          <p className="mt-2 text-surface-600 dark:text-surface-400">Create your account</p>
        </div>
        <div id="authentication" className="min-h-[300px]" />
        <div className="text-center mt-4">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            Already have an account? <Link to="/login" className="font-medium text-primary hover:text-primary-dark">Sign in</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default Signup;