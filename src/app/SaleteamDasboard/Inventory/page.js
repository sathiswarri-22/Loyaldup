'use client'

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    Itemcode: '',
    Model: '',
    price: '',
    Brand: '',
    Inward: '',
    Outward: '0', 
    Current: '', 
  });

  const [editMode, setEditMode] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const router = useRouter();
  
  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api-inventory/get-product');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const existingProduct = products.find(product => product.Itemcode === newProduct.Itemcode);

    try {
      if (existingProduct) {
        const updatedProduct = {
          ...existingProduct,
          ...newProduct,
          Current: parseInt(existingProduct.Inward) + parseInt(newProduct.Inward) || 0, 
        };

        const response = await axios.put(`http://localhost:5005/api-Inventory/update/${existingProduct._id}`, updatedProduct);

        setProducts(products.map((product) =>
          product._id === existingProduct._id ? { ...product, ...updatedProduct } : product
        ));
      } else {
        const response = await axios.post('http://localhost:5005/api-inventory/add-product', newProduct);
        setProducts([...products, response.data]);
      }
        fetchProducts()
      setNewProduct({
        Itemcode: '',
        Model: '',
        price: '',
        Brand: '',
        Inward: '',
        Outward: '0',
        Current: '',
      });
    } catch (error) {
      console.error('Error adding or updating product:', error);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target; 
  
    if (name === 'Inward') {
      const inwardValue = parseInt(value) || 0; 
      setNewProduct({
        ...newProduct,
        [name]: value, 
        Current: inwardValue, 
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: value, 
      });
    }
  };
  

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value,
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5005/api-Inventory/update/${id}`, editedProduct);
      setProducts(products.map((product) =>
        product._id === id ? { ...product, ...editedProduct } : product
      ));
      setEditMode(null);
      setEditedProduct({});
    } catch (error) {
      console.error('Error saving edited product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditMode(product._id);
    setEditedProduct(product);
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5005/api-Inventory/delete/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleBackClick = () => {
    router.push('/SaleteamDasboard/Dasboard');  
};
 
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-100 to-teal-300">
      <div className="w-full max-w-7xl p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-teal-700 mb-6">Inventory</h2>
        <button 
                    onClick={handleBackClick}
                    className="p-3 bg-white text-black rounded-full shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                    <ChevronLeft size={24} />
                </button>


        <div className="overflow-x-auto shadow-lg border border-gray-200 rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-gray-600">Item Code</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">Model</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">Price</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">Brand</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">Inward</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">Outward</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">Current</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t" key={newProduct._id}>
                <td><input className="w-full p-2 border border-gray-300 rounded" type="text" name="Itemcode" value={newProduct.Itemcode} onChange={handleInputChange} /></td>
                <td><input className="w-full p-2 border border-gray-300 rounded" type="text" name="Model" value={newProduct.Model} onChange={handleInputChange} /></td>
                <td><input className="w-full p-2 border border-gray-300 rounded" type="number" name="price" value={newProduct.price} onChange={handleInputChange} /></td>
                <td><input className="w-full p-2 border border-gray-300 rounded" type="text" name="Brand" value={newProduct.Brand} onChange={handleInputChange} /></td>
                <td><input className="w-full p-2 border border-gray-300 rounded" type="number" name="Inward" value={newProduct.Inward} onChange={handleInputChange} /></td>
                <td><input className="w-full p-2 border border-gray-300 rounded" type="number" name="Outward" value={newProduct.Outward} onChange={handleInputChange} /></td>
                <td><input className="w-full p-2 border border-gray-300 rounded" type="number" name="Current" value={newProduct.Current} readOnly /></td>
                <td>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleAddProduct}>Add Product</button>
                </td>
              </tr>

              {products.map((product) => (
                <tr key={product._id} className="border-t hover:bg-gray-50">
                  <td>{editMode === product._id ? (
                    <input className="w-full p-2 border border-gray-300 rounded" type="text" name="Itemcode" value={editedProduct.Itemcode} onChange={handleEditInputChange} />
                  ) : (
                    product.Itemcode
                  )}</td>
                  <td>{editMode === product._id ? (
                    <input className="w-full p-2 border border-gray-300 rounded" type="text" name="Model" value={editedProduct.Model} onChange={handleEditInputChange} />
                  ) : (
                    product.Model
                  )}</td>
                  <td>{editMode === product._id ? (
                    <input className="w-full p-2 border border-gray-300 rounded" type="number" name="price" value={editedProduct.price} onChange={handleEditInputChange} />
                  ) : (
                    product.price
                  )}</td>
                  <td>{editMode === product._id ? (
                    <input className="w-full p-2 border border-gray-300 rounded" type="text" name="Brand" value={editedProduct.Brand} onChange={handleEditInputChange} />
                  ) : (
                    product.Brand
                  )}</td>
                  <td>{editMode === product._id ? (
                    <input className="w-full p-2 border border-gray-300 rounded" type="number" name="Inward" value={editedProduct.Inward} onChange={handleEditInputChange} />
                  ) : (
                    product.Inward
                  )}</td>
                  <td>{editMode === product._id ? (
                    <input className="w-full p-2 border border-gray-300 rounded" type="number" name="Outward" value={editedProduct.Outward} onChange={handleEditInputChange} />
                  ) : (
                    product.Outward
                  )}</td>
                  <td>{editMode === product._id ? (
                    <input className="w-full p-2 border border-gray-300 rounded" type="number" name="Current" value={editedProduct.Current} onChange={handleEditInputChange} />
                  ) : (
                    product.Current
                  )}</td>
                  <td className="flex space-x-2">
                    {editMode === product._id ? (
                      <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={() => handleSaveEdit(product._id)}>Save</button>
                    ) : (
                      <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600" onClick={() => handleEdit(product)}>Edit</button>
                    )}
                    <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => deleteProduct(product._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
