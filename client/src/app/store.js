import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import notesReducer from '../features/notes/notesSlice';
import csrfReducer from '../features/csrf/csrfSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        notes: notesReducer,
        csrf: csrfReducer,
    },
});