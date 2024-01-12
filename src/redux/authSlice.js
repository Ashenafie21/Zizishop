
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setUser: (state, action) => {
//       state.user = action.payload; 
//     },
//     clearUser: (state) => {
//       state.user = null;
//     },
//   },
// });

// export const { setUser, clearUser } = authSlice.actions;
// export default authSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      // Check if action.payload is serializable
      if (isSerializable(action.payload)) {
        state.user = action.payload;
      } else {
        // Handle non-serializable payload (log an error, throw an exception, etc.)
        console.error("Non-serializable payload detected in setUser action");
      }
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

// Utility function to check if an object is serializable
function isSerializable(obj) {
  try {
    JSON.stringify(obj);
    return true;
  } catch (e) {
    return false;
  }
}

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
