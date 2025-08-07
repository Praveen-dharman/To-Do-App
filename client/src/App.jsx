import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { SiGoogletasks } from "react-icons/si";
import { MdOutlinePostAdd } from "react-icons/md";


function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks?filter=${filter}`);
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
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/tasks`, newTask);
      setTasks([response.data, ...tasks]);
      setNewTask({ title: '', description: '' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTaskStatus = async (task) => {
    try {
      const updatedTask = { ...task, is_completed: !task.is_completed };
      await axios.put(`${import.meta.env.VITE_API_URL}/api/tasks/${task.id}`, updatedTask);
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="  text-gray-100 p-4 md:p-8 w-full h-full mx-auto">
  <header className="text-center mb-8">
    <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-2">
      <span className="text-green-400"><SiGoogletasks/></span> Task-of-the-day
    </h1>
    <p className="text-gray-400 text-sm md:text-base">
      Your personal command center for daily objectives. Add, track, and complete your tasks with effortless precision.
    </p>
  </header>

  {/* Progress Bar */}
  <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700 shadow-lg">
    <div className="text-center text-gray-300 text-sm mb-2">
      {tasks.length > 0
        ? `${tasks.filter((task) => task.is_completed).length} of ${tasks.length} tasks completed`
        : "No tasks yet"}
    </div>
    {tasks.length > 0 && (
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-300"
          style={{
            width: `${(tasks.filter((task) => task.is_completed).length / tasks.length) * 100}%`,
          }}
        ></div>
      </div>
    )}
  </div>

  {/* Task Form */}
  <div className="bg-gray-800 rounded-xl p-5 mb-6 border border-gray-700 shadow-lg">
    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <span className="text-green-400"><MdOutlinePostAdd/></span> Create a New Objective
    </h2>
    <div className="space-y-3">
      <div>
        <label htmlFor="title" className="block text-sm text-gray-400 mb-1">Task Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={newTask.title}
          onChange={handleInputChange}
          placeholder="e.g., Buy groceries"
          className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm text-gray-400 mb-1">Details (Optional)</label>
        <input
          type="text"
          name="description"
          id="description"
          value={newTask.description}
          onChange={handleInputChange}
          placeholder="e.g., Milk, bread, and eggs for the weekend."
          className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <button 
        onClick={addTask}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors duration-200 shadow-lg shadow-green-500/20"
      >
        <span><MdOutlinePostAdd/></span> Add Task
      </button>
    </div>
  </div>

  {/* Filter Buttons */}
  <div className="flex justify-center gap-2 mb-6">
    <button 
      className={`px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 ${filter === 'all' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
      onClick={() => setFilter('all')}
    >
      All
    </button>
    <button 
      className={`px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 ${filter === 'active' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
      onClick={() => setFilter('active')}
    >
      Active
    </button>
    <button 
      className={`px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 ${filter === 'completed' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
      onClick={() => setFilter('completed')}
    >
      Completed
    </button>
  </div>

  {/* Task List */}
  <div className="space-y-3">
    {tasks.map(task => (
      <div 
        key={task.id} 
        className={`bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md flex justify-between items-start transition-opacity duration-200 ${task.is_completed ? 'opacity-60' : ''}`}
      >
        <div className="flex-1">
          <h3 className={`font-medium ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-100'}`}>{task.title}</h3>
          {task.description && (
            <p className={`text-sm mt-1 ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-400'}`}>{task.description}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <button 
            onClick={() => toggleTaskStatus(task)}
            className={`px-3 py-1 rounded text-sm font-medium ${task.is_completed ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900' : 'bg-green-600 hover:bg-green-700 text-white'}`}
          >
            {task.is_completed ? 'Undo' : 'Complete'}
          </button>
          <button 
            onClick={() => deleteTask(task.id)}
            className="px-3 py-1 rounded text-sm font-medium bg-red-600 hover:bg-red-700 text-white"
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
