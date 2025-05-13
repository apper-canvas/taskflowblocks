/**
 * Service for handling task operations using ApperClient
 */

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

/**
 * Fetch all tasks with optional filtering
 * @param {Object} filters - Optional filters for tasks
 * @param {string} filters.status - Filter by status
 * @param {string} filters.category - Filter by category
 * @returns {Promise<Array>} - Array of task objects
 */
export const fetchTasks = async (filters = {}) => {
  try {
    const apperClient = getApperClient();
    const tableName = 'task24';
    
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "title" } },
        { Field: { Name: "description" } },
        { Field: { Name: "due_date" } },
        { Field: { Name: "priority" } },
        { Field: { Name: "status" } },
        { Field: { Name: "category" } },
        { Field: { Name: "CreatedOn" } },
        { Field: { Name: "Owner" } }
      ],
      whereGroups: []
    };
    
    // Add filters if provided
    const conditions = [];
    
    if (filters.status && filters.status !== 'all') {
      conditions.push({
        FieldName: "status",
        operator: "ExactMatch",
        values: [filters.status]
      });
    }
    
    if (filters.category && filters.category !== 'all') {
      conditions.push({
        FieldName: "category",
        operator: "ExactMatch",
        values: [filters.category]
      });
    }
    
    if (conditions.length > 0) {
      params.whereGroups.push({
        operator: "AND",
        conditions
      });
    }
    
    // Sort by creation date, newest first
    params.orderBy = [
      {
        field: "CreatedOn",
        direction: "DESC"
      }
    ];
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    // Transform the data to match our application's structure
    return response.data.map(task => ({
      id: task.Id.toString(),
      title: task.title,
      description: task.description,
      dueDate: task.due_date,
      priority: task.priority,
      status: task.status,
      category: task.category,
      createdAt: task.CreatedOn,
      owner: task.Owner
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

/**
 * Create a new task
 * @param {Object} taskData - Task data to create
 * @returns {Promise<Object>} - Created task object
 */
export const createTask = async (taskData) => {
  try {
    const apperClient = getApperClient();
    const tableName = 'task24';
    
    const response = await apperClient.createRecord(tableName, {
      title: taskData.title,
      description: taskData.description,
      due_date: taskData.dueDate,
      priority: taskData.priority,
      status: taskData.status,
      category: taskData.category
    });
    
    if (!response || !response.data) {
      throw new Error("Failed to create task");
    }
    
    // Transform to match our app's structure
    return {
      id: response.data.Id.toString(),
      title: response.data.title,
      description: response.data.description,
      dueDate: response.data.due_date,
      priority: response.data.priority,
      status: response.data.status,
      category: response.data.category,
      createdAt: response.data.CreatedOn
    };
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

/**
 * Update an existing task
 * @param {string} taskId - ID of the task to update
 * @param {Object} taskData - Updated task data
 * @returns {Promise<Object>} - Updated task object
 */
export const updateTask = async (taskId, taskData) => {
  try {
    const apperClient = getApperClient();
    const tableName = 'task24';
    
    const response = await apperClient.updateRecord(tableName, {
      Id: taskId,
      ...taskData
    });
    
    if (!response || !response.data) {
      throw new Error("Failed to update task");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

/**
 * Delete a task
 * @param {string} taskId - ID of the task to delete
 */
export const deleteTask = async (taskId) => {
  try {
    const apperClient = getApperClient();
    const tableName = 'task24';
    
    await apperClient.deleteRecord(tableName, { RecordIds: [taskId] });
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};