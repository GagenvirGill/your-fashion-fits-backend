// app.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const categoryRoutes = require('./routes/categoryRoutes.js');
const itemRoutes = require('./routes/itemRoutes.js');

const app = express();

const uploadFolder = './uploads';
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.use('/uploads', express.static(uploadFolder));

app.use('/category', categoryRoutes);
app.use('/item', itemRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
