import { NotePT } from "../../static/types.tsx";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NotesState = {
  notes: NotePT[];
};

const initialState: NotesState = {
  notes: [],
};

export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setNotes: (state, action: PayloadAction<NotePT[]>) => {
      state.notes = action.payload;
    },
    addNote: (state, action: PayloadAction<NotePT>) => {
      state.notes.push(action.payload);
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(
        (note) => note.noteId !== action.payload,
      );
    },
    updateNote: (
      state,
      action: PayloadAction<{
        noteId: string;
        note: {
          mood: number;
          actions: number[];
          desc: string;
        };
      }>,
    ) => {
      state.notes = state.notes.map((note: NotePT) =>
        note.noteId === action.payload.noteId
          ? { ...note, ...action.payload.note }
          : note,
      );
    },
  },
});

export const { setNotes, addNote, deleteNote, updateNote } = notesSlice.actions;
export default notesSlice.reducer;
