import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addToCart, getCart, removeCartItem, updateCartItem } from "../../services/cartService.js";

export const loadCart = createAsyncThunk("cart/load", async () => getCart());
export const addItem = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      return await addToCart(productId, quantity);
    } catch (err) {
      return rejectWithValue({
        message: err.message,
        code: err.code,
        status: err.response?.status,
      });
    }
  }
);
export const updateItem = createAsyncThunk("cart/update", async ({ productId, quantity }) => updateCartItem(productId, quantity));
export const removeItem = createAsyncThunk("cart/remove", async (productId) => removeCartItem(productId));

const slice = createSlice({
  name: "cart",
  initialState: { items: [], status: "idle", error: null },
  reducers: {
    clearCart(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      .addCase(addItem.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(addItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      });
  },
});

export default slice.reducer;
export const { clearCart } = slice.actions;
