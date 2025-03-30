import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../redux/store.tsx";
import { useCallback, useState } from "react";
import classnames from "classnames";

import "./style.less";

import { ActionPT, MoodPT } from "../../static/types.tsx";
import { ACTIONS, MOODS } from "../../static/static.tsx";
import { v4 as uuidv4 } from "uuid";

import { createNoteFb } from "../../firebase/firestoreService.ts";
import { addNote } from "../../redux/slices/notesSlice.tsx";

import Page from "../../components/layout/Page";
import Heading from "../../components/blocks/Heading";
import Button from "../../components/controls/Button";
import Window from "../../components/layout/Window";

function AddNote() {
  const dispatch = useAppDispatch(),
    { userId } = useAppSelector((state: RootState) => state.user),
    [moodId, setMoodId] = useState<number | undefined>(undefined),
    [actions, setActions] = useState<Set<number>>(new Set()),
    [textarea, setTextarea] = useState(""),
    [warnWindow, setWarnWindow] = useState(false);

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
    if (!userId) {
      console.error("Войдите, чтобы создать запись!");
      return;
    }

    if (!moodId) {
      console.error("Не выбрано настроение!");
      return;
    }

    const newNote = {
      id: uuidv4(),
      date: new Date().toISOString(),
      mood: moodId,
      actions: Array.from(actions as Set<number>).sort((a, b) => a - b),
      desc: textarea,
    };

    try {
      const createdNote = await createNoteFb(userId, newNote);
      if (createdNote) {
        dispatch(addNote(newNote));
        console.log("Запись успешно добавлена!");

        // Делаем сброс состояний
        setMoodId(undefined);
        setActions(new Set());
        setTextarea("");
      }
    } catch (err) {
      console.error(err);
    }
  }, [actions, dispatch, userId, moodId, textarea]);

  console.log("AddNote");

  return (
    <Page className="AddNote">
      <Heading>Запиши свое настроение</Heading>

      <div className="AddNoteMoods">
        <div>Настроение:</div>
        <div>
          {MOODS.map(({ id, name }: MoodPT, idx) => (
            <div
              key={id}
              className={classnames("AddNoteMood", {
                active: idx + 1 === moodId,
              })}
              onClick={() => setMoodId(MOODS[id - 1].id)}
            >
              {name}
            </div>
          ))}
        </div>
      </div>

      <div className="AddNoteActions">
        <div>Активности:</div>

        <div>
          {ACTIONS.map(({ id, name }: ActionPT) => (
            <div
              key={id}
              className={classnames("AddNoteAction", {
                active: Array.from(actions).includes(id),
              })}
              onClick={() => handleAction(id)}
            >
              {name}
            </div>
          ))}
        </div>
      </div>

      <textarea
        className="textarea"
        style={{ width: "450px", height: "50px" }}
        onChange={(e) => setTextarea(e.target.value)}
        placeholder="Поделись дополнительными мыслями..."
        value={textarea}
      />

      <Button
        onClick={() => {
          if (!moodId || !actions.size) {
            return setWarnWindow(true);
          }

          handleAddNote();
        }}
      >
        Сохранить
      </Button>

      <Window
        open={warnWindow}
        height={230}
        onClose={() => setWarnWindow(false)}
        isUnderstand
        confirm={
          <>
            <div style={{ marginBottom: "16px" }}>
              {!moodId ? "Не выбрано настроение!" : "Не выбрана активность!"}
            </div>
            <div>
              Для добавления записи необходимо <br /> выбрать{" "}
              {!moodId ? "настроение" : "активность(и)"}
            </div>
          </>
        }
      />
    </Page>
  );
}

export default AddNote;
