import Product from '../models/Product.js';

// Add Product
export const addProduct = async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  const userId = req.user.id; // Extract user ID from the authenticated request

  try {
    const product = await Product.create({ name, description, price, stock, category, userId });
    res.status(201).json({ message: 'Product added successfully.', product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product.' });
  }
};

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
};

// Get Product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category } = req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    await product.update({ name, description, price, stock, category });
    res.status(200).json({ message: 'Product updated successfully.', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product.' });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    await product.destroy();
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product.' });
  }
};

