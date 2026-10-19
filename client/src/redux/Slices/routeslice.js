import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// API call
export const checkHealth = createAsyncThunk(
  "health/checkHealth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/health`);

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error.message || "Backend connection failed"
      );
    }
  }
);

const initialState = {
  success: false,
  status: "idle",
  message: "Backend status not checked yet",
  timestamp: null,
  uptime: 0,
};

const healthSlice = createSlice({
  name: "health",
  initialState,
  reducers: {
    resetHealth: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkHealth.pending, (state) => {
        state.status = "loading";
        state.message = "Checking backend...";
      })
      .addCase(checkHealth.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      })
      .addCase(checkHealth.rejected, (state, action) => {
        state.success = false;
        state.status = "unhealthy";
        state.message =
          action.payload || "Backend connection failed";
      });
  },
});

export const { resetHealth } = healthSlice.actions;

export default healthSlice.reducer;