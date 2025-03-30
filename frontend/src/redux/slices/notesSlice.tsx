import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotePT } from "../../static/types.tsx";

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
      state.notes = state.notes.filter((note) => note.id !== action.payload);
    },
    //   TODO: updateNote
  },
});

export const { setNotes, addNote, deleteNote } = notesSlice.actions;
export default notesSlice.reducer;
