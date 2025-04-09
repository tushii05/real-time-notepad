import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNotes, CreateNote, UpdateNote, DeleteNoteData } from '../../api/auth';

export const loadNotes = createAsyncThunk('notes/loadNotes', async () => {
    const data = await fetchNotes();
    return data.notes;
});

export const createNote = createAsyncThunk(
    'notes/createNote',
    async ({ title, content, theme, csrfToken }) => {
        const newNote = await CreateNote(title, content, theme, csrfToken);
        return newNote;
    }
);

export const updateNote = createAsyncThunk(
    'notes/updateNote',
    async ({ id, title, content, theme, csrfToken }) => {
        const updatedNote = await UpdateNote(id, title, content, theme, csrfToken);
        return updatedNote;
    }
);

export const deleteNote = createAsyncThunk(
    'notes/deleteNote',
    async ({ id, csrfToken }) => {
        await DeleteNoteData(id, csrfToken);
        return id;
    }
);

const notesSlice = createSlice({
    name: 'notes',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadNotes.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(loadNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createNote.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateNote.fulfilled, (state, action) => {
                const index = state.items.findIndex(note => note.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.items = state.items.filter(note => note.id !== action.payload);
            });
    },
});

export default notesSlice.reducer;