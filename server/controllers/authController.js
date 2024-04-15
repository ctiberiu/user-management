const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwtUtils');
const pool = require('../db');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input fields (e.g., check for required fields, email format)
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Retrieve user from the database based on the provided email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    // Check if user with the provided email exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token for the authenticated user
    const token = jwtUtils.encodeToken({ userId: user.id, email: user.email });

    const decoded = jwtUtils.decodeToken(token);

    // Respond with the JWT token
    res.status(200).json({ token });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'An error occurred while logging in' });
  }
};

const registerUser = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    // Validate input fields (e.g., check for required fields, email format)
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the email is already registered
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const query = {
      text: 'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)',
      values: [first_name, last_name, email, hashedPassword],
    };

    await pool.query(query);

    // Respond with success message
    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
};

module.exports = { loginUser, registerUser };
