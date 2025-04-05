export type ActionPT = { id: number; name: string };
export type MoodPT = { id: number; name: string };
export type NotePT = {
  noteId: string;
  date: string;
  mood: number;
  actions: number[];
  desc: string;
};
