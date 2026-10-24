// Classes Tailwind compartilhadas entre as páginas que antes importavam Workouts.css
// (Workouts, WorkoutEditor, StudentDetail, AddToWorkoutModal, ExercisePicker)

export const WORKOUTS_PAGE =
  "flex-1 px-10 py-8 bg-[var(--bg-page)] text-[var(--text)] max-md:pt-[72px] max-md:px-5 max-md:pb-6";
export const WORKOUTS_HEADER = "flex items-start justify-between gap-4 mb-6 max-md:flex-col";
export const WORKOUTS_SUBTITLE = "mb-5 text-[var(--text-muted)]";
export const STUDENT_HEADER_ACTIONS = "flex gap-2.5";
export const FLEX_NONE_NO_UNDERLINE = "flex-none no-underline";

export const WORKOUTS_BACK =
  "inline-flex items-center gap-1.5 mb-4 text-[var(--text-primary)] text-sm font-semibold no-underline";

export const WORKOUTS_EMPTY =
  "flex flex-col items-start gap-3.5 max-w-[760px] px-6 py-7 bg-[var(--bg-surface)] border border-dashed border-[var(--border)] rounded-[14px] text-[var(--text-muted)]";

export const WORKOUTS_LIST = "flex flex-col gap-3.5 max-w-[760px]";
export const WORKOUT_CARD =
  "flex items-start justify-between gap-4 px-5 py-[18px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.04)] max-md:flex-col";
export const WORKOUT_CARD_MAIN = "min-w-0";
export const WORKOUT_CARD_TITLE = "flex items-center flex-wrap gap-2.5 mb-1";
export const WORKOUT_CARD_TITLE_H3 = "text-[17px]";
export const WORKOUT_BADGE =
  "px-2.5 py-0.5 rounded-full bg-[var(--bg-primary-soft)] text-[var(--text-primary)] text-xs font-semibold";
export const WORKOUT_GOAL = "text-sm text-[var(--text-secondary)]";
export const WORKOUT_META = "my-1 mb-2 text-[13px] text-[var(--text-muted)]";
export const WORKOUT_PREVIEW = "pl-[18px] text-sm text-[var(--text-secondary)]";
export const WORKOUT_CARD_ACTIONS = "flex items-center gap-2";
export const WORKOUT_DELETE =
  "grid place-items-center w-[38px] h-[38px] border border-[var(--border)] rounded-lg bg-transparent text-[var(--text-danger)] cursor-pointer hover:bg-[var(--bg-hover)]";

export const EDITOR_FORM = "max-w-[860px]";
export const EDITOR_FIELDS = "grid grid-cols-2 gap-4 max-md:grid-cols-1";
export const EDITOR_SECTION = "my-3 mb-3.5 text-lg";
export const EDITOR_LINES = "flex flex-col gap-2.5 mb-4";
export const EDITOR_LINE =
  "flex items-end gap-3 px-3.5 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl max-md:flex-wrap";
export const EDITOR_LINE_NAME = "flex-1 min-w-0 flex flex-col gap-0.5 max-md:basis-full";
export const EDITOR_LINE_NAME_SPAN = "text-xs text-[var(--text-muted)]";
export const ABOVE_LEVEL = "text-[var(--text-warning)] not-italic font-semibold";
export const EDITOR_NUM = "flex flex-col gap-1 w-[72px] text-xs text-[var(--text-muted)]";
export const EDITOR_NUM_LOAD = "w-24";

export const INPUT_BOX =
  "px-2.5 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-surface)] text-[var(--text)] text-sm disabled:opacity-70 disabled:cursor-not-allowed";

export const EDITOR_LINE_ACTIONS = "flex gap-1";
export const EDITOR_LINE_ACTION_BTN =
  "grid place-items-center w-8 h-8 border border-[var(--border)] rounded-lg bg-transparent text-[var(--text-secondary)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";
export const EDITOR_LINE_ACTION_BTN_DANGER = "text-[var(--text-danger)]";
export const EDITOR_ACTIONS = "flex gap-2.5";

export const PICKER_CARD = "max-w-[560px] max-h-[88vh] flex flex-col";
export const PICKER_SEARCH =
  "flex items-center gap-2 my-3.5 px-3 border border-[var(--border)] rounded-lg text-[var(--text-muted)]";
export const PICKER_SEARCH_INPUT = "flex-1 border-none outline-none bg-transparent py-[11px]";
export const PICKER_STATUS = "my-2 text-sm text-[var(--text-muted)]";
export const PICKER_LIST = "flex-1 min-h-[120px] my-2 mb-4 p-0 list-none overflow-y-auto";
export const PICKER_ITEM = "flex items-center justify-between gap-3 py-2.5 border-b border-[var(--border-subtle)]";
export const PICKER_ITEM_INFO = "flex flex-col gap-0.5 min-w-0";
export const PICKER_ITEM_SPAN = "text-xs text-[var(--text-muted)] capitalize";
export const PICKER_ITEM_BTN_EXTRA = "flex-none px-3.5 py-2 disabled:opacity-50 disabled:cursor-default";

export const ADD_ROW = "grid grid-cols-[1fr_1fr_1.2fr] gap-2.5";
