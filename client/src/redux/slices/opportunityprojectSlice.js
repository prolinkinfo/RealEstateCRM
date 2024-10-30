import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApi } from "../../services/api";

export const fetchOpportunityProjectData = createAsyncThunk(
  "fetchOpportunityProjectData",
  async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await getApi(
        user.role === "superAdmin"
          ? "api/opportunityproject"
          : `api/opportunityproject/?createBy=${user._id}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
);

const opportunityProjectSlice = createSlice({
  name: "opportunityProjectData",
  initialState: {
    data: [],
    isLoading: false,
    error: "",
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpportunityProjectData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOpportunityProjectData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
        state.error = "";
      })
      .addCase(fetchOpportunityProjectData.rejected, (state, action) => {
        state.isLoading = false;
        state.data = [];
        state.error = action.error.message;
      });
  },
});

export default opportunityProjectSlice.reducer;
