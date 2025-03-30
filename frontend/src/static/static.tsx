import { ActionPT, MoodPT } from "./types.tsx";

export const LINK_SING_IN = "/singIn";
export const LINK_SING_UP = "/singUp";

export const LINK_ADD_NOTE = "/addNote";
export const LINK_HISTORY = "/history";
export const LINK_HOME = ".";
export const LINK_PROFILE = "/profile";

export const MOODS: MoodPT[] = [
  { id: 1, name: "Ужасно" },
  { id: 2, name: "Плохо" },
  { id: 3, name: "Нормально" },
  { id: 4, name: "Хорошо" },
  { id: 5, name: "Супер" },
];

export const ACTIONS: ActionPT[] = [
  { id: 1, name: "Работа" },
  { id: 2, name: "Отдых" },
  { id: 3, name: "Друзья" },
  { id: 4, name: "Свидание" },
  { id: 5, name: "Спорт" },
  { id: 6, name: "Вечеринка" },
  { id: 7, name: "Кино" },
  { id: 8, name: "Чтение" },
  { id: 9, name: "Игры" },
  { id: 10, name: "Покупки" },
  { id: 11, name: "Вкусная еда" },
  { id: 12, name: "Уборка" },
];

export const MONTHS: {
    genitive: string[];
    nominative: string[];
    short: string[];
  } = {
    genitive: [
      "Января",
      "Февраля",
      "Марта",
      "Апреля",
      "Мая",
      "Июня",
      "Июля",
      "Августа",
      "Сентября",
      "Октября",
      "Ноября",
      "Декабря",
    ],
    nominative: [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ],
    short: [
      "Янв.",
      "Фев.",
      "Март",
      "Апр.",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сент.",
      "Окт.",
      "Нояб.",
      "Дек.",
    ],
  },
  DAYSWEEK: { full: string[]; short: string[] } = {
    full: [
      "Воскресенье",
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
    ],
    short: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  };
