const db = require('../db');

exports.getAllTasks = async (req, res) => {
  try {
    const { filter } = req.query;
    let query = 'SELECT * FROM tasks';
    
    if (filter === 'active') {
      query += ' WHERE is_completed = FALSE';
    } else if (filter === 'completed') {
      query += ' WHERE is_completed = TRUE';
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const [result] = await db.query(
      'INSERT INTO tasks (title, description) VALUES (?, ?)',
      [title, description]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      title, 
      description, 
      is_completed: false 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, is_completed } = req.body;
    
    const [result] = await db.query(
      'UPDATE tasks SET title = ?, description = ?, is_completed = ? WHERE id = ?',
      [title, description, is_completed, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ id, title, description, is_completed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};