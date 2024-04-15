// backend/app.js
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

// Mount authentication routes
app.use('/auth', authRoutes);

// Mount user routes
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Start server
const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
