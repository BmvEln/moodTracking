import React, { useCallback, useMemo, useState } from "react";

import { NotePT } from "../static/types.tsx";

import { getDate } from "./functions.tsx";

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
