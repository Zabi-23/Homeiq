//cilent/src/redux/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  currentUser: null,
  isLoggedIn: false,
  token: null,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true
      state.error = null
    },
    signInSuccess: (state, action) => {
      state.loading = false
      state.currentUser = action.payload.user
      state.token = action.payload.token
      state.isLoggedIn = true
    },
    signInFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.currentUser = null
      state.isLoggedIn = false
      state.token = null
    },
    updateUserStart: (state) => {
      state.loading = true
      state.error = null
    },
    updateUserSuccess: (state, action) => {
      state.loading = false
      state.currentUser = action.payload.user
    },
    updateUserFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    deleteUserStart: (state) => {
      state.loading = true
      state.error = null
    },
    deleteUserSuccess: (state) => {
      state.loading = false
      state.currentUser = null
      state.isLoggedIn = false
      state.token = null
    },
    deleteUserFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

  },
})

export const { signInStart, signInSuccess, signInFailure, logout, updateUserFailure, updateUserStart, updateUserSuccess, deleteUserFailure,
  deleteUserStart, deleteUserSuccess  } = userSlice.actions
 
export default userSlice.reducer
