// app.js
const express = require('express');
const cors = require('cors');
const categoryRoutes = require('./routes/categoryRoutes.js');
const itemRoutes = require('./routes/itemRoutes.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/category', categoryRoutes);
app.use('/item', itemRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;