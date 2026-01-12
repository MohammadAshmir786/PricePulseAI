import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProfile, login as loginApi, logout as logoutApi, register as registerApi, updateProfile as updateProfileApi, deleteProfile as deleteProfileApi } from "../../services/authService.js";

export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await loginApi(payload);
      return data.user;
    } catch (err) {
      return rejectWithValue({ message: err.message, code: err.code });
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await registerApi(payload);
      return data.user;
    } catch (err) {
      return rejectWithValue({ message: err.message, code: err.code });
    }
  }
);

export const fetchProfile = createAsyncThunk("auth/profile", async () => {
  return getProfile();
});

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      return await updateProfileApi(payload);
    } catch (err) {
      return rejectWithValue({ message: err.message, code: err.code });
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async (_, { rejectWithValue }) => {
    try {
      await deleteProfileApi();
      return true;
    } catch (err) {
      return rejectWithValue({ message: err.message, code: err.code });
    }
  }
);

const slice = createSlice({
  name: "auth",
  initialState: { user: null, status: "idle", initialized: false, error: null },
  reducers: {
    logout(state) {
      state.user = null;
      logoutApi();
    },
    markInitialized(state) {
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.initialized = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Login failed";
        state.initialized = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.initialized = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Registration failed";
        state.initialized = true;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        state.initialized = true;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.user = null;
        state.status = "idle";
        state.initialized = true;
        state.error = null;
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to update profile";
      })
      .addCase(deleteAccount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.user = null;
        state.status = "succeeded";
        state.error = null;
        logoutApi();
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to delete account";
      });
  },
});

export const { logout, markInitialized } = slice.actions;
export default slice.reducer;
