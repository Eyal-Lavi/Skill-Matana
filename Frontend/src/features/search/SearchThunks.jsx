import { createAsyncThunk } from "@reduxjs/toolkit";
import SearchAPI from "./SearchAPI";
import { selectHasSearched } from "./SearchSelectors";
import { searchActions } from "./SearchSlice";

export const searchUsers = createAsyncThunk(
  "search/searchUsers",
  async ({ name, skillId }, thunkAPI) => {
    const hasSearched = selectHasSearched(thunkAPI.getState());

    if (hasSearched) {
      thunkAPI.dispatch(searchActions.clearSearch());
    }

    try {
      const response = await SearchAPI.search(name, skillId);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      if (error.response?.status === 404) {
        const errorMessage = error.response?.data?.message || error.message;
        if (errorMessage.includes('No users found') || 
            errorMessage.includes('not found')) {
          return [];
        }
      }
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
