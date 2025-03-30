import React, { useCallback, useState } from "react";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../redux/store.tsx";

import "./style.less";

import { ACTIONS, MOODS } from "../../../static/static.tsx";
import { NotePT } from "../../../static/types.tsx";
import { IMG } from "../../../static/img.ts";

import { deleteNote } from "../../../redux/slices/notesSlice.tsx";
import { deleteNoteFb } from "../../../firebase/firestoreService.ts";
import { getDate } from "../../../functions/functions.tsx";

import Button from "../../controls/Button";
import Window from "../../layout/Window";

const ICONS = {
  delete: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20"
      width="20"
      viewBox="0 -960 960 960"
      fill="var(--textPrimary)"
    >
      <path d="m377.5-338.5 103-103 103 103L602-357 499-460l103-103-18.5-18.5-103 103-103-103L359-563l103 103-103 103 18.5 18.5Zm-64 161.5q-24.5 0-41-16.5t-16.5-41v-484h-39.5V-744H361v-27h238.5v27H744v25.5h-39.5v484q0 24.5-16.5 41T647-177H313.5Z" />
    </svg>
  ),
  edit: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="18"
      width="18"
      viewBox="0 -960 960 960"
      fill="var(--textPrimary)"
    >
      <path d="M120-120v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm584-528 56-56-56-56-56 56 56 56Z" />
    </svg>
  ),
  arrowLeft: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="22"
      viewBox="0 -960 960 960"
      fill="var(--textPrimary)"
    >
      <path
        d="M396.154-267.692 183.846-480l212.308-212.308 28.308 28.77L260.923-500h515.231v40H260.923l163.539 163.538-28.308 28.77Z"
        strokeWidth="30"
      />
    </svg>
  ),
  arrowRight: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="22"
      viewBox="0 -960 960 960"
      width="22"
      fill="var(--textPrimary)"
    >
      <path
        d="m547.692-267.692-28.307-28.77L682.923-460H200v-40h482.923L519.385-663.538l28.307-28.77L760-480 547.692-267.692Z"
        strokeWidth="30"
      />
    </svg>
  ),
};

function Note({ id, mood, actions, desc, date }: NotePT) {
  const dispatch = useAppDispatch(),
    { userId } = useAppSelector((state: RootState) => state.user),
    { hours, minutes } = getDate(date),
    [noteWindow, setNoteWindow] = useState(false);

  const handleDeleteNote = useCallback(async () => {
    if (!userId) {
      console.error("Пользователь с таким id не определен!");
      return;
    }

    try {
      const deletedNote = await deleteNoteFb(userId, id);
      if (deletedNote) {
        dispatch(deleteNote(id));
      }
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, id, userId]);

  return (
    <>
      <div
        className="Note"
        onClick={(e) => {
          const target = e.target as HTMLElement,
            closeBtn = target.classList.contains("Button");

          if (!closeBtn) {
            setNoteWindow(true);
          }
        }}
      >
        <div className="NoteHeader">
          <div>
            <div>{MOODS[mood - 1].name}</div>
            <div>•</div>
            <div>
              {hours}:{minutes}
            </div>
          </div>

          <div>
            <Button theme="secondary">Изменить</Button>
            <Button className="" theme="secondary" onClick={handleDeleteNote}>
              X
            </Button>
          </div>
        </div>

        <div className="NoteSeparate" />

        <div className="NoteDesc">{desc || "Нет мыслей..."}</div>

        <div className="NoteActions">
          {actions.map((action: number, i: number) => {
            if (i > 2) {
              return null;
            }

            return (
              <Button
                key={i}
                theme="secondary"
                className="noHover"
                style={{ cursor: i < 2 ? "default" : "pointer" }}
              >
                {i < 2 ? (
                  ACTIONS[action - 1].name
                ) : (
                  <img src={IMG.seeMore} width={30} height={30} alt="" />
                )}
              </Button>
            );
          })}
        </div>
      </div>

      <Window open={noteWindow} onClose={() => setNoteWindow(false)} hideClose>
        <div className="NoteWindow">
          <div className="NoteWindowTop">
            <div>{ICONS.arrowLeft}</div>
            <div>
              {hours}:{minutes}
            </div>
            <div>{ICONS.arrowRight}</div>
          </div>

          <div className="NoteWindowContent">
            <div>
              <div>{MOODS[mood - 1].name}</div>

              <div>
                <Button className="icon" theme="secondary">
                  {ICONS.edit}
                </Button>
                <Button className="icon" theme="secondary">
                  {ICONS.delete}
                </Button>
                <Button
                  className="icon"
                  theme="secondary"
                  onClick={() => setNoteWindow(false)}
                >
                  X
                </Button>
              </div>
            </div>

            <textarea
              className="textarea"
              style={{ width: "100%", height: "50px" }}
              // onChange={(e) => setTextarea(e.target.value)}
              readOnly={true}
              placeholder="Поделись дополнительными мыслями..."
              value={desc || "Нет мыслей..."}
            />
          </div>

          <div className="NoteActions">
            {actions.map((action: number, i: number) => {
              return (
                <Button
                  key={i}
                  theme="secondary"
                  className="noHover"
                  style={{ cursor: "default" }}
                >
                  {ACTIONS[action - 1].name}
                </Button>
              );
            })}
          </div>
        </div>
      </Window>
    </>
  );
}

function Notes({ data }: { data: Record<string, NotePT[]> }) {
  return (
    <div className="Notes">
      {Object.entries(data).map(([key, value], i: number) => {
        return (
          <React.Fragment key={i}>
            <div className="NotesDate">{key}</div>

            <div className="NotesGroup">
              {value.map((item) => (
                <Note key={item.id} {...item} />
              ))}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default Notes;
