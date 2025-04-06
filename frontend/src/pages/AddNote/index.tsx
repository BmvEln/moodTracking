import { useRef } from "react";
import classnames from "classnames";

import "./style.less";

import { ActionPT, MoodPT } from "../../static/types.tsx";
import { ACTIONS, MOODS } from "../../static/static.tsx";

import { useAddNote } from "../../functions/hooks.tsx";

import Page from "../../components/layout/Page";
import Heading from "../../components/blocks/Heading";
import Button from "../../components/controls/Button";
import Window from "../../components/layout/Window";

function AddNote() {
  const noticeSaveRef = useRef<HTMLDivElement | null>(null),
    {
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
    } = useAddNote(noticeSaveRef);

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

      <div
        className="AddNoteBtn"
        style={{
          width: "450px",
        }}
      >
        <Button
          className={btnSaveLoading ? "animLoading" : undefined}
          onClick={handleAddNote}
        >
          Сохранить
        </Button>

        <div ref={noticeSaveRef}>Сохранено!</div>
      </div>

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
