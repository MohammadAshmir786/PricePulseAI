import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchProducts } from "../../services/productService.js";

export const loadProducts = createAsyncThunk("products/load", async (params) => {
  return fetchProducts(params);
});

const slice = createSlice({
  name: "products",
  initialState: { items: [], total: 0, status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.total = action.payload.total;
      });
  },
});

export default slice.reducer;
