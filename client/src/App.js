import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks?filter=${filter}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [filter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const addTask = async () => {
    if (!newTask.title.trim()) return;
    
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', newTask);
      setTasks([response.data, ...tasks]);
      setNewTask({ title: '', description: '' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTaskStatus = async (task) => {
    try {
      const updatedTask = { ...task, is_completed: !task.is_completed };
      await axios.put(`http://localhost:5000/api/tasks/${task.id}`, updatedTask);
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>✅ Task-of-the-day</h1>
        <p className="subtitle">
          Your personal command center for daily objectives. Add, track, and complete your tasks with effortless precision.
        </p>
      </header>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-text">
          {tasks.length > 0
            ? `${tasks.filter((task) => task.is_completed).length} of ${tasks.length} tasks completed`
            : "No tasks yet"}
        </div>
        {tasks.length > 0 && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${
                  (tasks.filter((task) => task.is_completed).length / tasks.length) * 100
                }%`,
              }}
            ></div>
          </div>
        )}
      </div>

      {/* Task Form */}
      <div className="task-form">
        <h2> Create a New Objective</h2>
        <label htmlFor="title">Task Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={newTask.title}
          onChange={handleInputChange}
          placeholder="e.g., Buy groceries"
        />
        <label htmlFor="description">Details (Optional)</label>
        <input
          type="text"
          name="description"
          id="description"
          value={newTask.description}
          onChange={handleInputChange}
          placeholder="e.g., Milk, bread, and eggs for the weekend."
        />
        <button onClick={addTask}>➕ Add Task</button>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={filter === 'active' ? 'active' : ''} 
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''} 
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {/* Task List */}
      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className={`task-item ${task.is_completed ? 'completed' : ''}`}>
            <div className="task-content">
              <h3>{task.title}</h3>
              {task.description && <p>{task.description}</p>}
            </div>
            <div className="task-actions">
              <button 
                onClick={() => toggleTaskStatus(task)}
                className={task.is_completed ? 'completed-btn' : 'complete-btn'}
              >
                {task.is_completed ? 'Undo' : 'Complete'}
              </button>
              <button 
                onClick={() => deleteTask(task.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
