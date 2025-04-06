import React, { useEffect, useState } from "react";

import "./style.less";

import { ACTIONS, MOODS } from "../../../static/static.tsx";
import { ActionPT, NotePT } from "../../../static/types.tsx";
import { IMG } from "../../../static/img.ts";

import { getDate } from "../../../functions/functions.tsx";
import { useNoteWindows } from "../../../functions/hooks.tsx";

import Button from "../../controls/Button";
import Window from "../../layout/Window";
import Select from "../../controls/Select";

const ICONS: Record<string, React.ReactNode> = {
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

type NoteWindowBtnsProps = {
  editMode: boolean;
  setConfirmWindow: (v: boolean) => void;
  setEditMode: (v: boolean) => void;
  resetState: () => void;
  setNoteWindow: (v: boolean) => void;
};

function NoteWindowBtns({
  editMode,
  setConfirmWindow,
  setEditMode,
  resetState,
  setNoteWindow,
}: NoteWindowBtnsProps) {
  return (
    <div>
      {editMode ? (
        <Button theme="secondary" onClick={() => setConfirmWindow(true)}>
          Обновить
        </Button>
      ) : (
        <>
          <Button
            className="icon"
            onClick={() => {
              setEditMode(!editMode);

              resetState();
            }}
            theme="secondary"
          >
            {ICONS.edit}
          </Button>

          <Button
            className="icon"
            theme="secondary"
            onClick={() => setConfirmWindow(true)}
          >
            {ICONS.delete}
          </Button>
        </>
      )}

      <Button
        className="icon"
        theme="secondary"
        onClick={() => {
          setNoteWindow(false);
          setEditMode(false);

          resetState();
        }}
      >
        X
      </Button>
    </div>
  );
}

type WindowContentProps = {
  noteId: string;
  editMode: boolean;
  mood: number;
  setEditMode: (v: boolean) => void;
  actions: number[];
  desc: string;
  hours: string;
  minutes: string;
  confirmWindow: boolean;
  setConfirmWindow: (v: boolean) => void;
  noteWindow: boolean;
  setNoteWindow: (v: boolean) => void;
};

function NoteWindows({
  noteId,
  editMode,
  mood,
  setEditMode,
  actions,
  desc,
  hours,
  minutes,
  confirmWindow,
  setConfirmWindow,
  noteWindow,
  setNoteWindow,
}: WindowContentProps) {
  const {
    moodIdL,
    setMoodIdL,
    actionsL,
    descL,
    setDescL,
    isLoading,
    handleAction,
    handleClickYes,
    resetState,
  } = useNoteWindows(
    noteId,
    mood,
    actions,
    desc,
    setNoteWindow,
    editMode,
    setEditMode,
    setConfirmWindow,
  );

  useEffect(() => {
    resetState();
  }, [resetState, noteWindow]);

  return (
    <>
      <Window
        open={noteWindow}
        onClose={() => {
          setEditMode(false);
          setNoteWindow(false);
        }}
        hideClose
      >
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
              {editMode ? (
                <Select
                  width={150}
                  withoutNoSelected
                  // Гарантируем, что не будет undefined
                  curIdx={(moodIdL || 1) - 1}
                  onChange={(v) => setMoodIdL(v)}
                  variants={MOODS.map(
                    ({ id, name }: { id: number; name: string }) => ({
                      id,
                      name,
                    }),
                  )}
                />
              ) : (
                <div>{MOODS[mood - 1].name}</div>
              )}

              <NoteWindowBtns
                editMode={editMode}
                setConfirmWindow={setConfirmWindow}
                setEditMode={setEditMode}
                resetState={resetState}
                setNoteWindow={setNoteWindow}
              />
            </div>

            <TextArea
              editMode={editMode}
              descL={descL}
              setDescL={setDescL}
              desc={desc}
            />
          </div>

          <div className="NoteActions">
            {editMode
              ? ACTIONS.map(({ id, name }: ActionPT) => (
                  <Button
                    key={id}
                    onClick={() => handleAction(id)}
                    selected={Array.from(actionsL).includes(id)}
                  >
                    {name}
                  </Button>
                ))
              : actions.map((action: number, i: number) => (
                  <Button key={i} disabled>
                    {ACTIONS[action - 1].name}
                  </Button>
                ))}
          </div>
        </div>
      </Window>

      <Window
        open={confirmWindow}
        btnYesLoading={isLoading}
        onClose={() => setConfirmWindow(false)}
        confirm={`Вы точно хотите ${editMode ? "ОБНОВИТЬ" : "УДАЛИТЬ"}  заметку?`}
        onClickYes={handleClickYes}
      />
    </>
  );
}

type NoteHeaderProps = {
  mood: number;
  date: string;
  setEditMode: (v: boolean) => void;
  setNoteWindow: (v: boolean) => void;
  setConfirmWindow: (v: boolean) => void;
  hours: string;
  minutes: string;
};

function NoteHeader({
  mood,
  setEditMode,
  setNoteWindow,
  setConfirmWindow,
  hours,
  minutes,
}: NoteHeaderProps) {
  return (
    <div className="NoteHeader">
      <div>
        <div>{MOODS[mood - 1].name}</div>
        <div>•</div>
        <div>
          {hours}:{minutes}
        </div>
      </div>

      <div>
        <Button
          theme="secondary"
          onClick={() => {
            setEditMode(true);
            setNoteWindow(true);
          }}
        >
          Изменить
        </Button>
        <Button theme="secondary" onClick={() => setConfirmWindow(true)}>
          X
        </Button>
      </div>
    </div>
  );
}

type TextAreaProps = {
  editMode: boolean;
  descL: string;
  setDescL: (v: string) => void;
  desc: string;
};

function TextArea({ editMode, descL, setDescL, desc }: TextAreaProps) {
  return (
    <textarea
      className="textarea"
      style={{
        width: "100%",
        height: "50px",
        cursor: ["default", "text"][Number(editMode)],
        backgroundColor: ["var(--elDefaultBgHover)", "var(--elDefaultBg)"][
          Number(editMode)
        ],
      }}
      onChange={editMode ? (e) => setDescL(e.target.value) : undefined}
      readOnly={!editMode}
      value={editMode ? descL : desc || "Нет мыслей..."}
    />
  );
}

function Note({ noteId, mood, actions, desc, date }: NotePT) {
  const { hours, minutes } = getDate(date);

  const [confirmWindow, setConfirmWindow] = useState(false),
    [noteWindow, setNoteWindow] = useState(false),
    [editMode, setEditMode] = useState(false);

  if (!mood || !actions) {
    console.error("В записи отсутствует mood или actions");
    return;
  }

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
        <NoteHeader
          mood={mood}
          date={date}
          setEditMode={setEditMode}
          setNoteWindow={setNoteWindow}
          setConfirmWindow={setConfirmWindow}
          hours={hours}
          minutes={minutes}
        />

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
                  // TODO: Нажимается только на часть в картинкой
                  <img src={IMG.seeMore} width={30} height={30} alt="" />
                )}
              </Button>
            );
          })}
        </div>
      </div>

      <NoteWindows
        noteWindow={noteWindow}
        setNoteWindow={setNoteWindow}
        noteId={noteId}
        editMode={editMode}
        mood={mood}
        confirmWindow={confirmWindow}
        setConfirmWindow={setConfirmWindow}
        setEditMode={setEditMode}
        desc={desc}
        hours={hours}
        minutes={minutes}
        actions={actions}
      />
    </>
  );
}

type NotesProps = {
  data: Record<string, NotePT[]>;
};

function Notes({ data }: NotesProps) {
  return (
    <div className="Notes">
      {Object.entries(data).map(([key, value], i: number) => {
        return (
          <React.Fragment key={i}>
            <div className="NotesDate">{key}</div>

            <div className="NotesGroup">
              {value.map((item) => (
                <Note key={item.noteId} {...item} />
              ))}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default Notes;
