import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: {
    id: null,
    username: null,
    firstName: null,
    lastName: null,
    email: null,
    permissions: null,
    gender: null,
    profilePicture: 'asdasd',
    skills : null
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
        state.isAuthenticated = true;
        state.user = {
            id: action.payload.id,
            username: action.payload.username,
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
            email: action.payload.email,
            permissions: action.payload.permissions,
            gender: action.payload.gender,
            profilePicture: action.payload.profilePicture,
            bannerPicture: action.payload.bannerPicture,
            skills : action.payload.skills
        };

    },
    updateFromSession(state, action) {
      // this.login(state, action);
        state.isAuthenticated = true;
        state.user = {
            id: action.payload.id,
            username: action.payload.username,
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
            email: action.payload.email,
            permissions: action.payload.permissions,
            gender: action.payload.gender,
            profilePicture: action.payload.profilePicture,
            bannerPicture: action.payload.bannerPicture,
            skills : action.payload.skills
        };
    },
    logout(state) {
        state.isAuthenticated = false;
        state.user = {
            id: null,
            username: null,
            firstName: null,
            lastName: null,
            email: null,
            permissions: null,
            gender: null,
            profilePicture: null,
            bannerPicture: null,
            skills : null
        };
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;