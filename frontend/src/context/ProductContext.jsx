import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchProducts = async () => {
    setStatus('loading');
    try {
      const response = await axios.get(`${BASE_URL}/api/products?page=${page}&limit=${rowsPerPage}`);
      setProducts(response.data.products);
      setTotalItems(response.data.totalItems);
      setStatus('succeeded');
    } catch (err) {
      setError(err.message);
      setStatus('failed');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage]);

  const toggleRecommended = async (id, value) => {
    try {
      await axios.put(`${BASE_URL}/api/products/${id}`, { isRecommended: !value });
      setStatus('succeeded');
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id ? { ...product, isRecommended: !product.isRecommended } : product
        )
      );
    } catch (err) {
      setError(err.message);
      setStatus('failed');
    }
  };

  const toggleBestSeller = async (id, value) => {
    try {
      await axios.put(`${BASE_URL}/api/products/${id}`, { isRecommended: !value });
      setStatus('succeeded');
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id ? { ...product, isBestseller: !product.isBestseller } : product
        )
      );
    } catch (err) {
      setError(err.message);
      setStatus('failed');
    }
  };

  const addProduct = async (body) => {
    try {
      const newProduct = await axios.post(`${BASE_URL}/api/products`, body);
      setStatus('succeeded');
      setProducts(prevProducts => [...prevProducts, newProduct.data]);
      setTotalItems(totalItems + 1);
    } catch (err) {
      setError(err.message);
      setStatus('failed');
    }
  };

  const updateProduct = async (id, body) => {
    try {
      await axios.put(`${BASE_URL}/api/products/${id}`, body);
      setStatus('succeeded');
      setProducts(prevProducts => prevProducts.map((product) => {
        if (product._id === id) {
          for (let key in body) {
            product[key] = body[key];
          }
        }
        return product;
      }));
    } catch (err) {
      setError(err.message);
      setStatus('failed');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      setStatus('succeeded');
      setProducts(prevProducts => prevProducts.filter((product) => product._id !== id));
      setTotalItems(totalItems - 1);
    } catch (err) {
      setError(err.message);
      setStatus('failed');
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        status,
        error,
        page,
        rowsPerPage,
        totalItems,
        setPage,
        setRowsPerPage,
        toggleRecommended,
        toggleBestSeller,
        deleteProduct,
        updateProduct,
        addProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
