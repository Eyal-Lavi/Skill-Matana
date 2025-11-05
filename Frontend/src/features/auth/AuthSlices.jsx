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
    bannerPicture: null,
    skills: null,
    connections: []
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
        skills: action.payload.skills,
        connections: action.payload.connections || []
      };
    },
    updateFromSession(state, action) {
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
        skills: action.payload.skills,
        connections: action.payload.connections || []
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
        skills: null,
        connections: []
      };
    },
    addSkill(state, action) {
      if (!state.user.skills) {
        state.user.skills = [];
      }

      const exists = state.user.skills.some(skill => skill.id === action.payload.id);
      if (!exists) {
        state.user.skills.push(action.payload);
      }
    },
    removeConnection(state, action) {
        const userId = action.payload;
        if (Array.isArray(state.user.connections)) {
            state.user.connections = state.user.connections.filter(
                (connection) => connection.id !== userId
            );
        }
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
