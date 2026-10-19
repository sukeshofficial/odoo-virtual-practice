import { createSlice } from "@reduxjs/toolkit";

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
    setHealth: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetHealth: () => initialState,
  },
});

export const { setHealth, resetHealth } = healthSlice.actions;

export default healthSlice.reducer;