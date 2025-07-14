import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  pdfUploaded: boolean;
  pdfName?: string;
  createdAt: number;
}

interface ChatState {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isLoading: boolean;
  error: string | null;
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
}

const initialState: ChatState = {
  currentSession: null,
  sessions: [],
  isLoading: false,
  error: null,
  uploadStatus: 'idle',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentSession: (state, action: PayloadAction<ChatSession>) => {
      state.currentSession = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      if (state.currentSession) {
        state.currentSession.messages.push(action.payload);
      }
    },
    createNewSession: (state, action: PayloadAction<string>) => {
      const newSession: ChatSession = {
        id: action.payload,
        messages: [],
        pdfUploaded: false,
        createdAt: Date.now(),
      };
      state.currentSession = newSession;
      state.sessions.unshift(newSession);
    },
    setPdfUploaded: (state, action: PayloadAction<{ fileName: string }>) => {
      if (state.currentSession) {
        state.currentSession.pdfUploaded = true;
        state.currentSession.pdfName = action.payload.fileName;
      }
    },
    setUploadStatus: (state, action: PayloadAction<ChatState['uploadStatus']>) => {
      state.uploadStatus = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearMessages: (state) => {
      if (state.currentSession) {
        state.currentSession.messages = [];
      }
    },
  },
});

export const {
  setCurrentSession,
  addMessage,
  createNewSession,
  setPdfUploaded,
  setUploadStatus,
  setLoading,
  setError,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer;