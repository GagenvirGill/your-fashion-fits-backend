// server.js
require('dotenv').config();
const { sequelize, connectDB } = require('./config/db');
const app = require('./app');
const modelSetup = require('./models/index.js');

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();
    modelSetup(sequelize);
    await sequelize.sync({ alter: true });

    console.log('Database synced successfully.');
    console.log('Registered models:', Object.keys(sequelize.models));

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
