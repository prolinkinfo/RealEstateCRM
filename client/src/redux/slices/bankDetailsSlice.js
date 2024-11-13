import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApi } from "services/api";

export const fetchBankData = createAsyncThunk(
  "fetchBankData",
  async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await getApi("api/bank-details");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

const getBankSlice = createSlice({
  name: "bankData",
  initialState: {
    data: [],
    isLoading: false,
    error: "",
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBankData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBankData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = "";
      })
      .addCase(fetchBankData.rejected, (state, action) => {
        state.isLoading = false;
        state.data = [];
        state.error = action.error.message;
      });
  },
});

export default getBankSlice.reducer;
