import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { useSelector } from 'react-redux';
import { createTask } from '../services/taskService';
import { format } from 'date-fns';

// Declare icons at the top
const PlusIcon = getIcon('Plus');
const XIcon = getIcon('X');
const CalendarIcon = getIcon('Calendar');
const TagIcon = getIcon('Tag');
const CheckCircle2Icon = getIcon('CheckCircle2');
const FlagIcon = getIcon('Flag');
const ArrowDownIcon = getIcon('ArrowDown');
const ArrowUpIcon = getIcon('ArrowUp');
const LayersIcon = getIcon('Layers');
const CheckIcon = getIcon('Check');

function MainFeature({ onAddTask, categories, reloadTasks }) {
  const { tasks } = useSelector(state => state.tasks);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'not-started',
    category: 'Work'
  });
  const [errors, setErrors] = useState({});
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
    if (!isFormOpen) {
      // Reset form when opening
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        status: 'not-started',
        category: 'Work'
      });
      setErrors({});
      setIsAdvancedOpen(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < currentDate) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setIsSubmitting(true);
      // Format task data for API
      const taskData = {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        priority: formData.priority,
        status: formData.status,
        category: formData.category
      };
      
      await createTask(taskData);
      toast.success('Task added successfully!');
      reloadTasks();
      toggleForm();
    } catch (error) {
      toast.error('Failed to create task: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const toggleAdvanced = () => {
    setIsAdvancedOpen(!isAdvancedOpen);
  };

  return (
    <div className="w-full">
      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-xl font-semibold mb-2 sm:mb-0">Task Manager</h2>
          <button
            onClick={toggleForm}
            className={`btn ${isFormOpen ? 'btn-outline text-red-500' : 'btn-primary'} 
              flex items-center gap-2 shadow-sm transition-all duration-300 transform hover:scale-105`}
          >
            {isFormOpen ? (
              <>
                <XIcon className="w-5 h-5" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <PlusIcon className="w-5 h-5" />
                <span>Add New Task</span>
              </>
            )}
          </button>
        </div>
        
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="border border-surface-200 dark:border-surface-700 rounded-xl p-4 bg-surface-50 dark:bg-surface-800">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                      Task Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="What needs to be done?"
                      className={`input-field ${errors.title ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Add details about this task..."
                      className="input-field resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="dueDate" className="block text-sm font-medium mb-1 flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1 inline text-primary" />
                        Due Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className={`input-field ${errors.dueDate ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                      />
                      {errors.dueDate && (
                        <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium mb-1 flex items-center">
                        <LayersIcon className="w-4 h-4 mr-1 inline text-primary" />
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="input-field"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <button 
                    type="button"
                    onClick={toggleAdvanced}
                    className="flex items-center text-sm text-primary hover:text-primary-dark transition-colors gap-1"
                  >
                    {isAdvancedOpen ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                    {isAdvancedOpen ? 'Hide' : 'Show'} Advanced Options
                  </button>
                  
                  <AnimatePresence>
                    {isAdvancedOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden"
                      >
                        <div>
                          <label htmlFor="priority" className="block text-sm font-medium mb-1 flex items-center">
                            <FlagIcon className="w-4 h-4 mr-1 inline text-primary" />
                            Priority
                          </label>
                          <div className="flex gap-3">
                            {['low', 'medium', 'high'].map((priority) => (
                              <label 
                                key={priority}
                                className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border cursor-pointer transition-all
                                  ${formData.priority === priority 
                                    ? priority === 'high' 
                                      ? 'bg-red-50 border-red-500 text-red-700 dark:bg-red-900 dark:bg-opacity-20 dark:border-red-500 dark:text-red-400'
                                      : priority === 'medium'
                                        ? 'bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-900 dark:bg-opacity-20 dark:border-amber-500 dark:text-amber-400'
                                        : 'bg-green-50 border-green-500 text-green-700 dark:bg-green-900 dark:bg-opacity-20 dark:border-green-500 dark:text-green-400'
                                    : 'border-surface-300 hover:bg-surface-100 dark:border-surface-600 dark:hover:bg-surface-700'
                                  }`}
                              >
                                <input
                                  type="radio"
                                  name="priority"
                                  value={priority}
                                  checked={formData.priority === priority}
                                  onChange={handleChange}
                                  className="sr-only"
                                />
                                <span className="text-sm capitalize">
                                  {priority === 'high' && '🔴 '}
                                  {priority === 'medium' && '🟠 '}
                                  {priority === 'low' && '🟢 '}
                                  {priority}
                                </span>
                                {formData.priority === priority && (
                                  <CheckIcon className="w-4 h-4" />
                                )}
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="status" className="block text-sm font-medium mb-1 flex items-center">
                            <TagIcon className="w-4 h-4 mr-1 inline text-primary" />
                            Status
                          </label>
                          <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="input-field"
                          >
                            <option value="not-started">Not Started</option>
                            <option value="in-progress">In Progress</option>
                            <option value="on-hold">On Hold</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className={`btn btn-primary flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <CheckCircle2Icon className="w-5 h-5" />
                      Create Task
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isFormOpen && (
          <div className="mt-2 bg-surface-50 dark:bg-surface-800 p-4 rounded-lg border border-surface-200 dark:border-surface-700">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-auto flex-1">
                <h3 className="text-lg font-medium mb-1">Quick Stats</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                  <div className="px-4 py-3 bg-white dark:bg-surface-700 rounded-lg shadow-sm border border-surface-200 dark:border-surface-600">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {tasks.length}
                    </div>
                    <div className="text-xs text-surface-500 dark:text-surface-400">Total Tasks</div>
                  </div>
                  <div className="px-4 py-3 bg-white dark:bg-surface-700 rounded-lg shadow-sm border border-surface-200 dark:border-surface-600">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {tasks.filter(task => task.status === 'in-progress').length}
                    </div>
                    <div className="text-xs text-surface-500 dark:text-surface-400">In Progress</div>
                  </div>
                  <div className="px-4 py-3 bg-white dark:bg-surface-700 rounded-lg shadow-sm border border-surface-200 dark:border-surface-600">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {tasks.filter(task => task.status === 'completed').length}
                    </div>
                    <div className="text-xs text-surface-500 dark:text-surface-400">Completed</div>
                  </div>
                  <div className="px-4 py-3 bg-white dark:bg-surface-700 rounded-lg shadow-sm border border-surface-200 dark:border-surface-600">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {tasks.filter(task => task.status === 'not-started').length}
                    </div>
                    <div className="text-xs text-surface-500 dark:text-surface-400">Not Started</div>
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-auto">
                <motion.button
                  onClick={toggleForm}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 px-5 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white rounded-xl shadow-md flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Create New Task</span>
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainFeature;