import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Adjust the path as per your project structure
const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
    tableName: 'Products', // Custom table name if needed
  }
);

Product.associate = (models) => {
  Product.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user',
  });
};

export default Product;

