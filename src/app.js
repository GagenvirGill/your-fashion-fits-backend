// app.js
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;