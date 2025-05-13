import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { setTasks, setLoading, setError } from '../store/tasksSlice';
import { fetchTasks } from '../services/taskService';
import Home from './Home';

function Dashboard() {
  const dispatch = useDispatch();
  const { filter, categoryFilter } = useSelector(state => state.tasks);
  const { user } = useSelector(state => state.user);

  const loadTasks = async () => {
    try {
      dispatch(setLoading(true));
      const filters = {
        status: filter !== 'all' ? filter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined
      };
      const tasks = await fetchTasks(filters);
      dispatch(setTasks(tasks));
    } catch (error) {
      dispatch(setError(error.message));
      console.error('Error loading tasks:', error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filter, categoryFilter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Home reloadTasks={loadTasks} />
    </motion.div>
  );
}

export default Dashboard;