import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPoll: null,
  results: null,
  history: [],
  hasAnswered: false,
  selectedAnswer: null,
  timeRemaining: null,
};

const pollComponent = createSlice({
  name: "poll",
  initialState,
  reducers: {
    setCurrentPoll: (state, action) => {
      const poll = action.payload;
      state.currentPoll = poll;
      state.hasAnswered = false;
      state.selectedAnswer = null;
      state.results = null;
      state.timeRemaining =
        poll?.remainingTime !== undefined
          ? poll.remainingTime
          : poll?.timeLimit || 60;
    },

    setResults: (state, action) => {
      state.results = action.payload;
    },

    setHistory: (state, action) => {
      state.history = action.payload;
    },

    addToHistory: (state, action) => {
      state.history.unshift(action.payload);
    },

    setHasAnswered: (state, action) => {
      state.hasAnswered = action.payload;
    },

    setSelectedAnswer: (state, action) => {
      state.selectedAnswer = action.payload;
    },

    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },

    decrementTime: (state) => {
      if (state.timeRemaining > 0) state.timeRemaining -= 1;
    },

    clearCurrentPoll: (state) => {
      state.currentPoll = null;
      state.hasAnswered = false;
      state.selectedAnswer = null;
      state.timeRemaining = null;
    },

    resetPoll: () => initialState,
  },
});

export const {
  setCurrentPoll,
  setResults,
  setHistory,
  addToHistory,
  setHasAnswered,
  setSelectedAnswer,
  setTimeRemaining,
  decrementTime,
  clearCurrentPoll,
  resetPoll,
} = pollComponent.actions;

export default pollComponent.reducer;
