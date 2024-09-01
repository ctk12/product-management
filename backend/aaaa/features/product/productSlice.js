import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  products: [],
  status: 'idle',
  error: null,
  page: 1,
  totalItems: 0,
  rowsPerPage: 10,
};

// Fetch products with pagination
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async ({ page, rowsPerPage }) => {
    const response = await axios.get(`/api/products?page=${page}&limit=${rowsPerPage}`);
    return response.data;
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    toggleRecommended(state, action) {
      const product = state.products.find(prod => prod.id === action.payload);
      if (product) {
        product.isRecommended = !product.isRecommended;
      }
    },
    toggleBestSeller(state, action) {
      const product = state.products.find(prod => prod.id === action.payload);
      if (product) {
        product.isBestseller = !product.isBestseller;
      }
    },
    changePage(state, action) {
      state.page = action.payload;
    },
    changeRowsPerPage(state, action) {
      state.rowsPerPage = action.payload;
    }
  },
  extraReducers: {
    [fetchProducts.pending]: (state) => {
      state.status = 'loading';
    },
    [fetchProducts.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.products = action.payload.products;
      state.totalItems = action.payload.totalItems;
    },
    [fetchProducts.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
  },
});

export const { toggleRecommended, toggleBestSeller, changePage, changeRowsPerPage } = productSlice.actions;

export default productSlice.reducer;
