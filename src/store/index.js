import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./storeComponent/userComponent";
import pollReducer from "./storeComponent/pollComponent";
import chatReducer from "./storeComponent/chatComponent";
import studentsReducer from "./storeComponent/studentComponent";

export const store = configureStore({
  reducer: {
    user: userReducer,
    poll: pollReducer,
    chat: chatReducer,
    students: studentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
