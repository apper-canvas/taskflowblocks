import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.user);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Render children only if authenticated
  return isAuthenticated ? children : null;
}

export default ProtectedRoute;