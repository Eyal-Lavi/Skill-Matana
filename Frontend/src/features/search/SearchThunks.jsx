import { createAsyncThunk } from "@reduxjs/toolkit";
import SearchAPI from "./SearchAPI";
import { selectHasSearched } from "./SearchSelectors";
import { searchActions } from "./SearchSlice";

export const searchUsers = createAsyncThunk(
  "search/searchUsers",
  async ({ name, skillId }, thunkAPI) => {
    const hasSearched = thunkAPI.getState(selectHasSearched);

    if (hasSearched) {
      thunkAPI.dispatch(searchActions.clearSearch());
    }

    try {
      const response = await SearchAPI.search(name, skillId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
