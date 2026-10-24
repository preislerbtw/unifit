// Classes Tailwind compartilhadas entre as páginas que antes importavam Professors.css
// (Professors, Workouts, WorkoutEditor, StudentDetail, Students, Requests, AddToWorkoutModal, ExercisePicker, Chat)

export const PROF_PAGE =
  "p-8 px-10 flex-1 bg-[var(--bg-page)] max-md:pt-[72px] max-md:px-5 max-md:pb-6";
export const PROF_SUBTITLE = "text-[var(--text-muted)] mb-6";

export const PROF_SEARCH =
  "flex items-center gap-2.5 max-w-[420px] px-3.5 mb-5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[10px] text-[var(--text-muted)] focus-within:border-[var(--text-primary)]";
export const PROF_SEARCH_INPUT = "flex-1 py-3 border-none outline-none text-sm bg-transparent";

export const PROF_NOTICE =
  "mb-5 px-4 py-3 rounded-[10px] bg-[var(--bg-primary-soft)] text-[var(--text-primary-strong)] text-sm";

export const PROF_GRID = "grid [grid-template-columns:repeat(auto-fill,minmax(290px,1fr))] gap-5";

export const PROFESSOR_CARD =
  "flex flex-col gap-3 p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.04)]";
export const PROFESSOR_HEADER = "flex items-center gap-3.5";
export const PROFESSOR_HEADER_H3 = "text-base mb-1";
export const PROFESSOR_AVATAR =
  "grid place-items-center w-[52px] h-[52px] shrink-0 rounded-full bg-[var(--primary)] text-[var(--text-on-primary)] font-bold text-[17px]";
export const PROFESSOR_TAG =
  "inline-block px-2.5 py-0.5 rounded-full bg-[var(--bg-primary-soft)] text-[var(--text-primary-strong)] text-xs font-semibold";
export const PROFESSOR_GYM = "flex items-center gap-1.5 text-[13px] text-[var(--text-muted)]";
export const PROFESSOR_BIO = "flex-1 text-sm text-[var(--text-secondary)]";
export const PROFESSOR_ACTIONS = "flex gap-2.5";

export const PROF_BTN =
  "inline-flex items-center justify-center gap-1.5 flex-1 px-3.5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-200";
export const PROF_BTN_PRIMARY = "border-none bg-[var(--primary)] text-[var(--text-on-primary)] hover:bg-[var(--primary-hover)]";
export const PROF_BTN_SECONDARY =
  "border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]";

export const MODAL_OVERLAY = "fixed inset-0 grid place-items-center p-5 bg-black/45 z-[300]";
export const MODAL_CARD =
  "relative w-full max-w-[420px] p-7 bg-[var(--bg-surface)] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)]";
export const MODAL_CLOSE =
  "absolute top-3.5 right-3.5 grid place-items-center w-[30px] h-[30px] border-none rounded-full bg-[var(--bg-muted)] cursor-pointer";
export const MODAL_SUBTITLE = "mb-5 text-[var(--text-muted)] text-sm";
export const MODAL_FIELD = "mb-4";
export const MODAL_FIELD_LABEL = "block mb-1.5 text-sm font-semibold";
export const MODAL_FIELD_INPUT =
  "w-full px-3.5 py-[11px] border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-surface)] focus:outline-none focus:border-[var(--text-primary)]";
export const MODAL_ERROR = "mb-3 text-[13px] text-[var(--text-danger)]";
export const MODAL_ACTIONS = "flex gap-2.5 mt-2";
