import React, { RefObject, useCallback, useMemo, useState } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store.tsx";

import { NotePT } from "../static/types.tsx";

import { getDate } from "./functions.tsx";
import { v4 as uuidv4 } from "uuid";
import {
  createNoteFb,
  deleteNoteFb,
  updateNoteFb,
} from "../firebase/firestoreService.ts";
import {
  addNote,
  deleteNote,
  updateNote,
} from "../redux/slices/notesSlice.tsx";

export function useFilteredNotes(notes: NotePT[]) {
  const [search, setSearch] = useState(""),
    [moodFilter, setMoodFilter] = useState<Set<number>>(new Set()),
    [actionFilter, setActionFilter] = useState<Set<number>>(new Set());

  const filteredData = useMemo(() => {
    if (!search && !moodFilter.size && !actionFilter.size) {
      return undefined;
    }

    return notes.filter((note: NotePT) => {
      // Проверка наличия фильтров
      const hasActiveFilter = actionFilter.size > 0,
        hasMoodFilter = moodFilter.size > 0,
        // Проверка соответствия заметки фильтрам
        matchesMood = Array.from(moodFilter).includes(note.mood),
        // Если [].every = true функция callback не выполняется, т.к. все значения будут true
        matchesAction = Array.from(actionFilter).every((v) =>
          note.actions.includes(v),
        ),
        matchesSearch = note.desc.toLowerCase().includes(search.toLowerCase());

      if (hasActiveFilter && hasMoodFilter) {
        return matchesAction && matchesMood && matchesSearch;
      } else if (hasMoodFilter) {
        return matchesMood && matchesSearch;
      } else {
        return matchesAction && matchesSearch;
      }
    });
  }, [actionFilter, moodFilter, notes, search]);

  const groupedNotes = useMemo(() => {
    // Если не выбраны фильтры, то используем notes
    return (filteredData || notes).reduce(
      (all: { [key: string]: NotePT[] }, note: NotePT) => {
        const { day, month, year } = getDate(note.date),
          dateStr = `${day}.${month}.${year}`;

        // Проверяем есть ли в объекте массив под нужным ключом
        // если нет, кладём пустой массив
        all[dateStr] = all[dateStr] || [];
        all[dateStr].push(note);

        return all;
      },
      {},
    );
  }, [filteredData, notes]);

  const updateFilter = useCallback(
    (
      state: Set<number>,
      setState: React.Dispatch<React.SetStateAction<Set<number>>>,
      v: number | undefined,
    ) => {
      if (typeof v === "undefined") {
        return setState(new Set());
      }

      if (state.has(v)) {
        state.delete(v);

        setState(new Set(state));

        return;
      }

      setState(new Set(state.add(v)));
    },
    [],
  );

  return {
    search,
    setSearch,
    moodFilter,
    setMoodFilter,
    actionFilter,
    setActionFilter,
    groupedNotes,
    updateFilter,
  };
}

export function useAddNote(noticeSaveRef: RefObject<HTMLDivElement | null>) {
  const dispatch = useAppDispatch(),
    { userId } = useAppSelector((state: RootState) => state.user),
    [moodId, setMoodId] = useState<number | undefined>(undefined),
    [actions, setActions] = useState<Set<number>>(new Set()),
    [textarea, setTextarea] = useState(""),
    [warnWindow, setWarnWindow] = useState(false),
    [btnSaveLoading, setBtnSaveLoading] = useState(false);

  const handleAction = useCallback(
    (id: number) => {
      if (actions.has(id)) {
        actions.delete(id);

        setActions(new Set(actions));

        return;
      }

      setActions(new Set(actions.add(id)));
    },
    [actions],
  );

  const handleAddNote = useCallback(async () => {
    if (!moodId || !actions.size) {
      return setWarnWindow(true);
    }

    if (!userId) {
      console.error("Войдите, чтобы создать запись!");
      return;
    }

    if (!moodId) {
      console.error("Не выбрано настроение!");
      return;
    }

    const newNote = {
      noteId: uuidv4(),
      date: new Date().toISOString(),
      mood: moodId,
      actions: Array.from(actions as Set<number>).sort((a, b) => a - b),
      desc: textarea,
    };

    try {
      setBtnSaveLoading(true);
      const createdNote = await createNoteFb(userId, newNote);
      if (createdNote) {
        dispatch(addNote(newNote));
        console.log("Запись успешно добавлена!");

        // Делаем сброс состояний
        setMoodId(undefined);
        setActions(new Set());
        setTextarea("");

        setBtnSaveLoading(false);
        if (noticeSaveRef.current) {
          noticeSaveRef.current.style.transform = "translateX(0)";

          setTimeout(() => {
            if (noticeSaveRef.current)
              noticeSaveRef.current.style.transform = "translateX(102%)";
          }, 2000);
        }
      }
    } catch (err) {
      console.error(err);
      setBtnSaveLoading(false);
    }
  }, [moodId, actions, userId, textarea, dispatch, noticeSaveRef]);

  return {
    moodId,
    setMoodId,
    actions,
    textarea,
    setTextarea,
    warnWindow,
    setWarnWindow,
    btnSaveLoading,
    handleAction,
    handleAddNote,
  };
}

export function useNoteWindows(
  noteId: string,
  mood: number,
  actions: number[],
  desc: string,
  setNoteWindow: (v: boolean) => void,
  editMode: boolean,
  setEditMode: (v: boolean) => void,
  setConfirmWindow: (v: boolean) => void,
) {
  const dispatch = useAppDispatch(),
    { userId } = useAppSelector((state: RootState) => state.user),
    [isLoading, setLoading] = useState(false);

  const [moodIdL, setMoodIdL] = useState<number | undefined>(mood);
  const [actionsL, setActionsL] = useState(new Set(actions));
  const [descL, setDescL] = useState(desc);

  const resetState = useCallback(() => {
    setMoodIdL(mood);
    setDescL(desc);
    setActionsL(new Set(actions));
  }, [actions, desc, mood]);

  const handleDeleteNote = useCallback(async () => {
    if (!userId) {
      console.error("Войдите, чтобы создать запись!");
      return;
    }

    try {
      const deletedNote = await deleteNoteFb(userId, noteId);
      if (deletedNote) {
        dispatch(deleteNote(noteId));
      }
    } catch (err) {
      console.error("Ошибка при удалении заметки", err);
    }
  }, [dispatch, noteId, userId]);

  const handleUpdateNote = useCallback(async () => {
    if (!userId) {
      console.error("Войдите, чтобы создать запись!");
      return;
    }

    if (!moodIdL) {
      console.error("Не выбрано настроение!");
      return;
    }

    const noteData = {
      mood: moodIdL,
      actions: Array.from(actionsL).sort((a, b) => a - b),
      desc: descL || "",
    };

    try {
      const updatedNote = await updateNoteFb(userId, noteId, noteData);
      if (updatedNote) {
        dispatch(updateNote({ noteId, note: noteData }));
        resetState();
        setNoteWindow(false);
        setEditMode(false);
      }
    } catch (err) {
      console.error(err);
    }
  }, [
    userId,
    moodIdL,
    actionsL,
    descL,
    noteId,
    dispatch,
    resetState,
    setNoteWindow,
    setEditMode,
  ]);

  const handleAction = useCallback(
    (id: number) => {
      if (actionsL.has(id)) {
        actionsL.delete(id);

        setActionsL(new Set(actionsL));

        return;
      }

      setActionsL(new Set(actionsL.add(id)));
    },
    [actionsL],
  );

  const handleClickYes = useCallback(async () => {
    setLoading(true);
    // Если юзер активировал окно в режиме редактирования,
    // значит он хочет обновить запись (+ в этом режиме не удаляются записи)
    if (editMode) {
      await handleUpdateNote();
    } else {
      await handleDeleteNote();
    }

    setLoading(false);
    setConfirmWindow(false);
  }, [editMode, handleDeleteNote, handleUpdateNote, setConfirmWindow]);

  return {
    moodIdL,
    setMoodIdL,
    actionsL,
    descL,
    setDescL,
    isLoading,
    handleAction,
    handleClickYes,
    resetState,
  };
}
