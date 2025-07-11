import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { wordpressAxios } from "@config"; // Update the import path
import { setVersion } from "./userSlice"; // Import setVersion action

// Types
export interface UsageDetails {
  plan_id: number;
  plan_name: string;
  user_name: string;
  user_email: string;
  words_used: number;
  words_total: number;
  images_used: number;
  images_total: number;
  credit_limit: number;
  credit_usage: number;
}

export interface UsageState {
  data: UsageDetails | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

// Initial state
const initialState: UsageState = {
  data: null,
  loading: false,
  error: null,
  lastFetched: null,
};

// Async thunk for fetching usage details
export const fetchUsageDetails = createAsyncThunk(
  "usage/fetchUsageDetails",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await wordpressAxios.get(
        "wp-json/custom/v1/get-usage-details"
      );
      return response.data as UsageDetails;
    } catch (error: any) {
      // Handle 404 error specifically
      if (error.response?.status === 404) {
        dispatch(setVersion(null));
        return rejectWithValue("Usage details not found (404)");
      }

      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch usage details"
      );
    }
  }
);

// Create slice
const usageSlice = createSlice({
  name: "usage",
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Reset usage state
    resetUsage: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
    },
    // Update specific usage values (for real-time updates)
    updateUsage: (state, action: PayloadAction<Partial<UsageDetails>>) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch usage details
      .addCase(fetchUsageDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsageDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
        state.lastFetched = Date.now();
      })
      .addCase(fetchUsageDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearError, resetUsage, updateUsage } = usageSlice.actions;

// Export reducer
export default usageSlice.reducer;

// Selectors
export const selectUsageData = (state: { usage: UsageState }) =>
  state.usage.data;
export const selectUsageLoading = (state: { usage: UsageState }) =>
  state.usage.loading;
export const selectUsageError = (state: { usage: UsageState }) =>
  state.usage.error;
export const selectLastFetched = (state: { usage: UsageState }) =>
  state.usage.lastFetched;

// Computed selectors
export const selectUsagePercentages = (state: { usage: UsageState }) => {
  const data = state.usage.data;
  if (!data) return null;

  return {
    wordsPercentage: (data.words_used / data.words_total) * 100,
    imagesPercentage: (data.images_used / data.images_total) * 100,
    creditsPercentage: (data.credit_usage / data.credit_limit) * 100,
  };
};
