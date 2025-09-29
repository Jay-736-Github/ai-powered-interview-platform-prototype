import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialInterviewState = {
  candidate: { name: null, email: null, phone: null },
  status: "pending",
  currentlyCollecting: null,
  messages: [],
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  finalScore: null,
  summary: null,
};

export const interviewSlice = createSlice({
  name: "interview",
  initialState: {
    currentInterview: { ...initialInterviewState },
    completedInterviews: [],
  },
  reducers: {
    initializeInterview: (state, action) => {
      const newInterview = { ...initialInterviewState };
      const { name, email, phone } = action.payload;
      newInterview.candidate = action.payload;

      let welcomeText = `Hello ${
        name || "Candidate"
      }! Welcome to the interview.`;
      if (email) {
        welcomeText += `\nEmail: ${email}`;
      }
      if (phone) {
        welcomeText += `\nPhone: ${phone}`;
      }

      newInterview.messages = [{ sender: "ai", text: welcomeText }];

      if (!name || !email || !phone) {
        newInterview.status = "collecting-info";
        newInterview.currentlyCollecting = !name
          ? "name"
          : !email
          ? "email"
          : "phone";
      } else {
        newInterview.status = "ready-to-start";
        newInterview.currentlyCollecting = null;
      }
      state.currentInterview = newInterview;
    },
    addMessage: (state, action) => {
      state.currentInterview.messages.push(action.payload);
    },
    setCollectingField: (state, action) => {
      state.currentInterview.currentlyCollecting = action.payload;
    },
    updateCandidateField: (state, action) => {
      const { field, value } = action.payload;
      state.currentInterview.candidate[field] = value;
    },
    setInterviewStatus: (state, action) => {
      state.currentInterview.status = action.payload;
    },
    setQuestions: (state, action) => {
      state.currentInterview.questions = action.payload;
    },
    submitAnswer: (state, action) => {
      state.currentInterview.answers.push(action.payload);
    },
    nextQuestion: (state) => {
      if (
        state.currentInterview.currentQuestionIndex <
        state.currentInterview.questions.length - 1
      ) {
        state.currentInterview.currentQuestionIndex += 1;
      } else {
        state.currentInterview.status = "completed";
      }
    },
    setFinalResults: (state, action) => {
      state.currentInterview.finalScore = action.payload.score;
      state.currentInterview.summary = action.payload.summary;
    },
    archiveCurrentInterview: (state) => {
      const completedSession = {
        ...state.currentInterview,
        id: uuidv4(),
        completedAt: new Date().toISOString(),
      };
      state.completedInterviews.push(completedSession);
      state.currentInterview = { ...initialInterviewState };
    },
    resetInterview: (state) => {
      state.currentInterview = { ...initialInterviewState };
    },
  },
});

export const {
  initializeInterview,
  addMessage,
  setCollectingField,
  updateCandidateField,
  setInterviewStatus,
  setQuestions,
  submitAnswer,
  nextQuestion,
  setFinalResults,
  archiveCurrentInterview,
  resetInterview,
} = interviewSlice.actions;

export default interviewSlice.reducer;
