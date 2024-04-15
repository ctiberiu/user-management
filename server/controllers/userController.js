const pool = require('../db');
const bcrypt = require('bcrypt');


const createUser = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {

    if(!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)',
      values: [first_name, last_name, email, hashedPassword],
    };

    await pool.query(query);

    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {

    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An error occurred while creating the user' });

  }
};

const getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE soft_delete = false');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'An error occurred while fetching the user' });
  }
};

const updateUser = async (req, res) => {const { id } = req.params;
  const { first_name, last_name, email, password } = req.body; // Extract editable fields only

  try {
    // Construct the SQL query dynamically based on the editable fields
    const query = {
      text: `UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4 WHERE id = $5`,
      values: [first_name, last_name, email, password, id],
    };

    // Execute the SQL query to update the user record
    await pool.query(query);

    // Send a success response back to the client
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    // Handle any errors that occur during the update process
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'An error occurred while updating the user' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    if (result.rowCount > 0) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'An error occurred while deleting the user' });
  }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };
