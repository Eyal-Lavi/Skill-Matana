import { createAsyncThunk } from "@reduxjs/toolkit";
import AdminAPI from './adminAPI';

export const fetchPendingSkillRequests = createAsyncThunk(
    'admin/fetchPendingSkillRequests',
    async(_ , thunkAPI) => {
        try{
            const response = await AdminAPI.getPendingSkillRequests();
            return response;
        }catch(error){
            return thunkAPI.rejectWithValue(error.message?.data?.message || error.message);
        }
    }

);