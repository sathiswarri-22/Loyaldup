'use client'

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, Plus, Save, Edit, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const token = localStorage.getItem('admintokens');
  const role = localStorage.getItem('role');

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

  // Filter products based on the search query
  const filteredProducts = products.filter((product) =>
    product.Model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.Brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.Itemcode?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

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

        await axios.put(`http://localhost:5005/api-Inventory/update/${existingProduct._id}`, updatedProduct, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProducts(products.map((product) =>
          product._id === existingProduct._id ? { ...product, ...updatedProduct } : product
        ));
      } else {
        const response = await axios.post('http://localhost:5005/api-inventory/add-product', newProduct, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts([...products, response.data]);
      }
      fetchProducts();
      setNewProduct({
        Itemcode: '',
        Model: '',
        price: '',
        Brand: '',
        Inward: '',
        Outward: '0',
        Current: '',
      });
      setShowAddForm(false);
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
      await axios.put(`http://localhost:5005/api-Inventory/update/${id}`, editedProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      await axios.delete(`http://localhost:5005/api-Inventory/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleBackClick = () => {
    const role = localStorage.getItem("role")?.trim().toLowerCase();
    console.log("I got the role:", role);
  
    if (role === "service engineer" || role === "engineer") {
      console.log("Redirecting to ServiceProject dashboard");
      router.push("/ServiceProject/Dasboard");
    } else if (role === "md") {
      console.log("Redirecting to MD dashboard");
      router.push("/admin/adminDasboard");
    } else {
      console.log("Redirecting to SalesTeam dashboard");
      router.push("/SaleteamDasboard/Dasboard");
    }
  };
  

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  const cancelEdit = () => {
    setEditMode(null);
    setEditedProduct({});
  };
  
  const purchaseOrder = () => {
    // Navigate to PurchaseOrder page with enquiryNo
    router.push('/SaleteamDasboard/PurchaseOrder');
   }
  
   const perfomaInvoice = () => {
    router.push('/SaleteamDasboard/Perfomainvoice');
   
  
   }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-100 to-teal-300">
      <div className="w-full max-w-7xl p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex justify-end gap-4 mt-4">
  <button
    onClick={() => purchaseOrder()}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition duration-300 transform hover:scale-105"
  >
    Purchase Order
  </button>

  <button 
    onClick={perfomaInvoice}
    className="flex items-center gap-2 px-4 mr-2 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
  >
    <FileText size={18} />
    Perfoma Invoice
  </button>
</div>
   
                    
                    
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBackClick}
                className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              <h2 className="text-2xl font-semibold text-gray-800">Inventory Management</h2>
            </div>
            
            {role === 'Stock Filler' && (
              <button 
                onClick={toggleAddForm}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                {showAddForm ? <X size={18} /> : <Plus size={18} />}
                {showAddForm ? 'Cancel' : 'Add Product'}
              </button>
            )}
          </div>
          
          {/* Add Product Form */}
          {showAddForm && role === 'Stock Filler' && (
            <div className="bg-teal-50 p-6 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Add New Product</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Item Code</label>
                  <input 
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" 
                    type="text" 
                    name="Itemcode" 
                    value={newProduct.Itemcode} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Model</label>
                  <input 
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" 
                    type="text" 
                    name="Model" 
                    value={newProduct.Model} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Brand</label>
                  <input 
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" 
                    type="text" 
                    name="Brand" 
                    value={newProduct.Brand} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Price</label>
                  <input 
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" 
                    type="number" 
                    name="price" 
                    value={newProduct.price} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Inward</label>
                  <input 
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" 
                    type="number" 
                    name="Inward" 
                    value={newProduct.Inward} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Current</label>
                  <input 
                    className="w-full p-2 bg-gray-100 border border-gray-200 rounded-lg" 
                    type="number" 
                    name="Current" 
                    value={newProduct.Current} 
                    readOnly 
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button 
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  onClick={handleAddProduct}
                >
                  Save Product
                </button>
              </div>
            </div>
          )}
          
          {/* Search Bar */}
          <div className="p-6 border-b border-gray-100">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Item Code, Model or Brand"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>
          
          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-teal-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inward</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outward</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
                  {role === 'Stock Filler' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={role === 'Stock Filler' ? 8 : 7} className="px-6 py-4 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-teal-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editMode === product._id ? (
                          <input 
                            className="w-full p-2 border border-gray-200 rounded-lg" 
                            type="text" 
                            name="Itemcode" 
                            value={editedProduct.Itemcode || ''} 
                            onChange={handleEditInputChange} 
                          />
                        ) : (
                          <span className="text-sm text-gray-800">{product.Itemcode}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editMode === product._id ? (
                          <input 
                            className="w-full p-2 border border-gray-200 rounded-lg" 
                            type="text" 
                            name="Model" 
                            value={editedProduct.Model || ''} 
                            onChange={handleEditInputChange} 
                          />
                        ) : (
                          <span className="text-sm text-gray-800">{product.Model}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editMode === product._id ? (
                          <input 
                            className="w-full p-2 border border-gray-200 rounded-lg" 
                            type="text" 
                            name="Brand" 
                            value={editedProduct.Brand || ''} 
                            onChange={handleEditInputChange} 
                          />
                        ) : (
                          <span className="text-sm text-gray-800">{product.Brand}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editMode === product._id ? (
                          <input 
                            className="w-full p-2 border border-gray-200 rounded-lg" 
                            type="number" 
                            name="price" 
                            value={editedProduct.price || ''} 
                            onChange={handleEditInputChange} 
                          />
                        ) : (
                          <span className="text-sm text-gray-800">{product.price}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editMode === product._id ? (
                          <input 
                            className="w-full p-2 border border-gray-200 rounded-lg" 
                            type="number" 
                            name="Inward" 
                            value={editedProduct.Inward || ''} 
                            onChange={handleEditInputChange} 
                          />
                        ) : (
                          <span className="text-sm text-gray-800">{product.Inward}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editMode === product._id ? (
                          <input 
                            className="w-full p-2 border border-gray-200 rounded-lg" 
                            type="number" 
                            name="Outward" 
                            value={editedProduct.Outward || ''} 
                            onChange={handleEditInputChange} 
                          />
                        ) : (
                          <span className="text-sm text-gray-800">{product.Outward}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editMode === product._id ? (
                          <input 
                            className="w-full p-2 border border-gray-200 rounded-lg" 
                            type="number" 
                            name="Current" 
                            value={editedProduct.Current || ''} 
                            onChange={handleEditInputChange} 
                          />
                        ) : (
                          <span className="text-sm text-gray-800">{product.Current}</span>
                        )}
                      </td>
                      {role === 'Stock Filler' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            {editMode === product._id ? (
                              <>
                                <button 
                                  className="p-1 rounded text-green-600 hover:bg-green-50"
                                  onClick={() => handleSaveEdit(product._id)}
                                  aria-label="Save changes"
                                >
                                  <Save size={18} />
                                </button>
                                <button 
                                  className="p-1 rounded text-gray-600 hover:bg-gray-50"
                                  onClick={cancelEdit}
                                  aria-label="Cancel edit"
                                >
                                  <X size={18} />
                                </button>
                              </>
                            ) : (
                              <button 
                                className="p-1 rounded text-teal-600 hover:bg-teal-50"
                                onClick={() => handleEdit(product)}
                                aria-label="Edit product"
                              >
                                <Edit size={18} />
                              </button>
                            )}
                            {!editMode && (
                              <button 
                                className="p-1 rounded text-red-600 hover:bg-red-50"
                                onClick={() => deleteProduct(product._id)}
                                aria-label="Delete product"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer with status information */}
          <div className="bg-teal-50 px-6 py-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;