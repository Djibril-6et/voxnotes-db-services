const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.config');

dotenv.config();

const app = express();

// Database connection
connectDB();

// Middleware
app.use(express.json());

// Use routes
app.use('/api', require('./routes/index.routes'));

const PORT = process.env.PORT || 9090;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});