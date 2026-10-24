// Classes Tailwind compartilhadas entre as páginas que antes importavam Dashboard.css
// (Dashboard, Students, Requests)

export const DASHBOARD_PAGE =
  "flex-1 px-10 py-8 bg-[var(--bg-page)] text-[var(--text)] max-md:pt-[72px] max-md:px-5 max-md:pb-6";
export const DASHBOARD_SUBTITLE = "mb-6 text-[var(--text-muted)]";
export const DASHBOARD_SECTION = "my-8 mb-3.5 text-lg";

export const STAT_GRID = "grid [grid-template-columns:repeat(auto-fill,minmax(210px,1fr))] gap-4";
export const STAT_CARD =
  "flex flex-col gap-1.5 p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.04)] text-[var(--text-primary)] no-underline";
export const STAT_CARD_STRONG = "text-[28px] text-[var(--text)]";
export const STAT_CARD_SPAN = "text-sm text-[var(--text-muted)]";
export const STAT_CARD_LINK_HOVER = "hover:border-[var(--primary)]";
export const STAT_CARD_SOON = "border-dashed shadow-none";
export const STAT_CARD_SOON_STRONG = "text-lg";
export const STAT_TITLE = "text-lg";

export const DASHBOARD_LIST = "flex flex-col gap-3.5 max-w-[760px]";
export const DASHBOARD_ROW =
  "flex items-center gap-[18px] px-5 py-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.04)]";
export const REQUEST_CARD = `${DASHBOARD_ROW} max-md:flex-wrap`;
export const DASHBOARD_ROW_H3 = "text-base";
export const DASHBOARD_ROW_P = "text-sm text-[var(--text-muted)]";

export const DASHBOARD_EMPTY =
  "max-w-[760px] px-5 py-8 text-center bg-[var(--bg-surface)] border border-dashed border-[var(--border)] rounded-[14px] text-[var(--text-muted)]";

export const REQUEST_INFO = "flex-1 min-w-0 flex flex-col gap-1";
export const REQUEST_INFO_P = "flex items-center gap-1.5 text-sm text-[var(--text-muted)]";
export const REQUEST_TITLE = "flex items-center flex-wrap gap-2.5";
export const REQUEST_ACTIONS = "flex flex-col gap-2 min-w-[110px] max-md:flex-row max-md:w-full";
export const REQUEST_ACTIONS_CHILD = "max-md:flex-1";
export const REQUEST_REJECT =
  "px-3.5 py-2.5 border border-[var(--text-danger)] rounded-lg bg-transparent text-[var(--text-danger)] text-sm font-semibold cursor-pointer hover:bg-[var(--bg-hover)]";
export const REQUEST_ERROR = "mb-4 px-3.5 py-2.5 rounded-lg bg-[var(--bg-warning)] text-[var(--text-warning)] text-sm";
export const REQUEST_CONFLICT = "text-[var(--text-warning)] font-semibold";
export const REQUEST_ACTIONS_BTN_DISABLED = "disabled:opacity-50 disabled:cursor-not-allowed";

export const STUDENT_CARD =
  "flex items-center gap-[18px] px-5 py-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.04)] max-md:flex-wrap";
export const STUDENT_AVATAR =
  "grid place-items-center w-12 h-12 shrink-0 rounded-full bg-[var(--primary)] text-[var(--text-on-primary)] font-bold";
export const STUDENT_INFO = "flex-1 min-w-0 flex flex-col gap-1";
export const STUDENT_INFO_H3 = "text-base";
export const STUDENT_INFO_P = "flex items-center gap-1.5 text-sm text-[var(--text-muted)]";
export const STUDENT_ACTIONS = "flex gap-2 max-md:w-full";
export const STUDENT_ACTIONS_BTN_EXTRA = "max-md:flex-1";
