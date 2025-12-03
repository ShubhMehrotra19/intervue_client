import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
};

const studentComponent = createSlice({
  name: "students",
  initialState,
  reducers: {
    setStudents: (state, action) => {
      state.list = action.payload;
    },
    addStudent: (state, action) => {
      state.list.push(action.payload);
    },
    removeStudent: (state, action) => {
      state.list = state.list.filter((s) => s.socketId !== action.payload);
    },
    resetStudents: () => initialState,
  },
});

export const { setStudents, addStudent, removeStudent, resetStudents } =
  studentComponent.actions;
export default studentComponent.reducer;
