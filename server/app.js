const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db'); // This now exports the pool from db.js

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

// Database connection check
db.query('SELECT 1')
  .then(() => console.log('Connected to MySQL database'))
  .catch(err => console.error('Error connecting to MySQL:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});