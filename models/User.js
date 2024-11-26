import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Adjust the path as per your project structure

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
  },
  resetToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetTokenExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

export default User;

