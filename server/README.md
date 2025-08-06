1. Clone this repository
2. Set up MySQL database:
   ```sql
   CREATE DATABASE task_of_the_day;
   USE task_of_the_day;
   CREATE TABLE tasks (
     id INT AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     description TEXT,
     is_completed BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );