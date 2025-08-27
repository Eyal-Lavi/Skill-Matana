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

export const updateSkillRequestStatus = createAsyncThunk(
    'admin/updateSkillRequestStatus',
    async ({ requestId, status }, thunkAPI) => {
      try {
        await AdminAPI.updateSkillRequestStatus(requestId, status);
        return { requestId };
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

export const updateSkillStatus = createAsyncThunk(
    'admin/updateSkillStatus',
    async ({ skillId, status }, thunkAPI) => {
      try {
        await AdminAPI.updateSkillStatus(skillId, status);
        return { skillId, status };
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );