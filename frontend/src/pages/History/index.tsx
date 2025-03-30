import { useCallback } from "react";
import { RootState, useAppSelector } from "../../redux/store.tsx";

import "./style.less";

import { ACTIONS, MOODS } from "../../static/static.tsx";

import { useFilteredNotes } from "../../functions/hooks.tsx";

import Page from "../../components/layout/Page";
import Heading from "../../components/blocks/Heading";
import Input from "../../components/controls/Input";
import Select from "../../components/controls/Select";
import Notes from "../../components/blocks/Notes";

function History() {
  const { notes } = useAppSelector((state: RootState) => state.notes);

  const {
    search,
    setSearch,
    moodFilter,
    setMoodFilter,
    actionFilter,
    setActionFilter,
    groupedNotes,
    updateFilter,
  } = useFilteredNotes(notes || []);

  const handleMoodChange = useCallback(
    (v: number | undefined) => {
      updateFilter(moodFilter, setMoodFilter, v);
    },
    [moodFilter, setMoodFilter, updateFilter],
  );

  const handleActiveChange = useCallback(
    (v: number | undefined) => {
      updateFilter(actionFilter, setActionFilter, v);
    },
    [actionFilter, setActionFilter, updateFilter],
  );

  return (
    <Page className="History">
      <Heading>История добавленных настроений</Heading>

      {!notes?.length ? (
        <div>Нет добавленных записей</div>
      ) : (
        <>
          <div style={{ marginBottom: "24px" }}>
            <Input
              width={476}
              placeholder="Поиск добавленных записей..."
              value={search}
              onChange={(v) => setSearch(v)}
            />
          </div>

          <div className="History__filters">
            {["по настроению", "по активности"].map((text, i) => {
              const isFilterByMood = !i;

              return (
                <div key={text}>
                  <div>Фильтрация {text}:</div>
                  <Select
                    width={220}
                    onChange={
                      isFilterByMood ? handleMoodChange : handleActiveChange
                    }
                    variants={(isFilterByMood ? MOODS : ACTIONS).map(
                      ({ id, name }: { id: number; name: string }) => ({
                        id,
                        name,
                      }),
                    )}
                  />
                </div>
              );
            })}
          </div>

          <Notes data={groupedNotes} />
        </>
      )}
    </Page>
  );
}

export default History;
