import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: {
    id: null,
    username: null,
    firstname: null,
    lastname: null,
    email: null,
    role: null,
    profilePicture: null,
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
        state.isAuthenticated = true;
        state.user = {
            id: action.payload.id,
            username: action.payload.username,
            firstname: action.payload.firstname,
            lastname: action.payload.lastname,
            email: action.payload.email,
            role: action.payload.role,
            profilePicture: action.payload.profilePicture,
        };

    },
    logout(state) {
        state.isAuthenticated = false;
        state.user = {
            id: null,
            username: null,
            firstname: null,
            lastname: null,
            email: null,
            role: null,
            profilePicture: null,
        };
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;