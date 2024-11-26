// config/database.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

// Initialize Sequelize instance
const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: 'postgres',
  logging: false, // Disable SQL query logging for production
});

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

export default sequelize; // Export the Sequelize instance

