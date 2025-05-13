import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

// Declare icons at the top
const ClipboardListIcon = getIcon('ClipboardList');
const FilterIcon = getIcon('Filter');
const LayersIcon = getIcon('Layers');
const ListFilterIcon = getIcon('ListFilter');
const CheckCircleIcon = getIcon('CheckCircle');
const PlayCircleIcon = getIcon('PlayCircle');
const CircleDashedIcon = getIcon('CircleDashed');
const CirclePauseIcon = getIcon('CirclePause');

function Home() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      {
        id: '1',
        title: 'Complete project proposal',
        description: 'Draft the project proposal document for client review',
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        status: 'in-progress',
        category: 'Work'
      },
      {
        id: '2',
        title: 'Grocery shopping',
        description: 'Buy vegetables, fruits, and other essentials',
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        status: 'not-started',
        category: 'Personal'
      },
      {
        id: '3',
        title: 'Schedule doctor appointment',
        description: 'Annual checkup with Dr. Smith',
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'low',
        status: 'not-started',
        category: 'Health'
      }
    ];
  });
  
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  const categories = ['Work', 'Personal', 'Health', 'Education', 'Other'];
  
  const addTask = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
    toast.success('Task added successfully!');
  };
  
  const updateTaskStatus = (id, newStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
    toast.info('Task status updated');
  };
  
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success('Task deleted successfully');
  };
  
  const filteredTasks = tasks.filter(task => {
    if (filter !== 'all' && task.status !== filter) return false;
    if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;
    return true;
  });
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'in-progress': return <PlayCircleIcon className="w-5 h-5 text-blue-500" />;
      case 'not-started': return <CircleDashedIcon className="w-5 h-5 text-gray-500" />;
      case 'on-hold': return <CirclePauseIcon className="w-5 h-5 text-amber-500" />;
      default: return <CircleDashedIcon className="w-5 h-5 text-gray-500" />;
    }
  };
  
  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'high': return 'task-high';
      case 'medium': return 'task-medium';
      case 'low': return 'task-low';
      default: return '';
    }
  };
  
  const getCategoryBadgeClass = (category) => {
    switch(category) {
      case 'Work': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Personal': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Health': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Education': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-6 px-4 sm:px-6 md:max-w-6xl"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar */}
        <div className="w-full md:w-1/4">
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <LayersIcon className="mr-2 h-5 w-5 text-primary" />
                Categories
              </h2>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  categoryFilter === 'all' 
                    ? 'bg-primary bg-opacity-10 text-primary'
                    : 'hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                All Categories
              </button>
              
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    categoryFilter === category 
                      ? 'bg-primary bg-opacity-10 text-primary'
                      : 'hover:bg-surface-100 dark:hover:bg-surface-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <FilterIcon className="mr-2 h-5 w-5 text-primary" />
                Status Filter
              </h2>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setFilter('all')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filter === 'all' 
                    ? 'bg-primary bg-opacity-10 text-primary'
                    : 'hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                All Tasks
              </button>
              
              <button
                onClick={() => setFilter('not-started')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filter === 'not-started' 
                    ? 'bg-primary bg-opacity-10 text-primary'
                    : 'hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                Not Started
              </button>
              
              <button
                onClick={() => setFilter('in-progress')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filter === 'in-progress' 
                    ? 'bg-primary bg-opacity-10 text-primary'
                    : 'hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                In Progress
              </button>
              
              <button
                onClick={() => setFilter('completed')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filter === 'completed' 
                    ? 'bg-primary bg-opacity-10 text-primary'
                    : 'hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                Completed
              </button>
              
              <button
                onClick={() => setFilter('on-hold')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filter === 'on-hold' 
                    ? 'bg-primary bg-opacity-10 text-primary'
                    : 'hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                On Hold
              </button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="w-full md:w-3/4">
          <MainFeature onAddTask={addTask} categories={categories} />
          
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <ClipboardListIcon className="mr-2 h-6 w-6 text-primary" />
                {filter === 'all' ? 'All Tasks' : filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ') + ' Tasks'}
                {categoryFilter !== 'all' && ` - ${categoryFilter}`}
              </h2>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-surface-500">
                  {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                </span>
                <div className="relative">
                  <button className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                    <ListFilterIcon className="h-5 w-5 text-surface-500" />
                  </button>
                </div>
              </div>
            </div>
            
            {filteredTasks.length > 0 ? (
              <div className="space-y-4">
                {filteredTasks.map(task => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`task-card ${getPriorityClass(task.priority)}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <button 
                            onClick={() => {
                              const newStatus = task.status === 'completed' ? 'not-started' : 'completed';
                              updateTaskStatus(task.id, newStatus);
                            }}
                            className="mt-1"
                          >
                            {getStatusIcon(task.status)}
                          </button>
                          
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                              <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-surface-400 dark:text-surface-500' : ''}`}>
                                {task.title}
                              </h3>
                              
                              <div className="flex flex-wrap gap-2">
                                <span className={`badge ${getCategoryBadgeClass(task.category)}`}>
                                  {task.category}
                                </span>
                                
                                <span className="badge bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-300">
                                  Due: {format(new Date(task.dueDate), 'MMM d')}
                                </span>
                                
                                <span className={`badge ${
                                  task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                                  task.priority === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                }`}>
                                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                              {task.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                          className="text-xs rounded-md border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800"
                        >
                          <option value="not-started">Not Started</option>
                          <option value="in-progress">In Progress</option>
                          <option value="on-hold">On Hold</option>
                          <option value="completed">Completed</option>
                        </select>
                        
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-surface-50 dark:bg-surface-800 rounded-lg border border-dashed border-surface-300 dark:border-surface-700">
                <ClipboardListIcon className="mx-auto h-12 w-12 text-surface-400" />
                <h3 className="mt-4 text-lg font-medium text-surface-900 dark:text-surface-100">No tasks found</h3>
                <p className="mt-1 text-surface-500 dark:text-surface-400">
                  {filter !== 'all' || categoryFilter !== 'all' 
                    ? 'Try changing your filters to see more tasks'
                    : 'Create your first task to get started'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Home;