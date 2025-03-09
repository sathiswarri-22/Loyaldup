"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const Getproduct = () => {
  const [products, setProducts] = useState([]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get("http://localhost:5005/api/getproductslist", {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log("I got the data", response.data);

      // Check if the response contains the 'getproducts' array
      if (Array.isArray(response.data.getproducts)) {
        setProducts(response.data.getproducts);
      } else {
        console.error("Expected an array in 'getproducts' but got:", response.data.getproducts);
      }
    } catch (err) {
      console.log("I got the error", err.message);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-8">Product List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="relative group">
                {product.productimage ? (
                  <img
                    src={`http://localhost:5005/api/uploads/${product.productimage}`}
                    alt={product.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-500">No Image Available</div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{product.title}</h2>
                <p className="text-gray-600 my-2">{product.description}</p>
                <p className="text-lg font-bold text-green-500">₹ {product.price.toLocaleString()}</p>
                <div className="mt-4 flex justify-between items-center">
                  <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">View Details</button>
                  <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors">Add to Cart</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No products available</p>
        )}
      </div>
    </div>
  );
};

export default Getproduct;
