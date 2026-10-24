// Classes Tailwind compartilhadas entre as páginas que antes importavam Schedule.css
// (Schedule, Requests)

export const SCHEDULE_PAGE =
  "flex-1 px-10 py-8 bg-[var(--bg-page)] text-[var(--text)] max-md:pt-[72px] max-md:px-5 max-md:pb-6";
export const SCHEDULE_SUBTITLE = "mb-6 text-[var(--text-muted)]";

export const SCHEDULE_TABS = "inline-flex gap-1 p-1 mb-6 bg-[var(--bg-muted)] rounded-[10px]";
export const SCHEDULE_TAB_BTN =
  "px-[18px] py-2 border-none rounded-lg bg-transparent text-[var(--text-muted)] text-sm font-semibold cursor-pointer";
export const SCHEDULE_TAB_BTN_ACTIVE =
  "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-[0_1px_3px_rgba(0,0,0,0.1)]";

export const SCHEDULE_LIST = "flex flex-col gap-3.5 max-w-[760px]";
export const APPOINTMENT_CARD =
  "flex items-center gap-[18px] px-5 py-[18px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.04)] max-md:flex-wrap";
export const APPOINTMENT_CARD_CANCELLED = "opacity-65";
export const APPOINTMENT_DATE =
  "flex flex-col items-center justify-center w-16 h-16 shrink-0 rounded-xl bg-[var(--bg-primary-soft)] text-[var(--text-primary)] leading-[1.1]";
export const APPOINTMENT_DATE_STRONG = "text-2xl";
export const APPOINTMENT_DATE_SPAN = "text-xs font-semibold uppercase";
export const APPOINTMENT_INFO = "flex-1 min-w-0 flex flex-col gap-1";
export const APPOINTMENT_INFO_P = "flex items-center gap-1.5 text-sm text-[var(--text-muted)]";
export const APPOINTMENT_WEEKDAY = "capitalize";
export const APPOINTMENT_TITLE = "flex items-center flex-wrap gap-2.5 mb-0.5";
export const APPOINTMENT_TITLE_H3 = "text-base";

export const STATUS_BADGE = "px-2.5 py-0.5 rounded-full text-xs font-semibold";
export const STATUS_PENDING = "bg-[var(--bg-warning)] text-[var(--text-warning)]";
export const STATUS_CONFIRMED = "bg-[var(--bg-success)] text-[var(--text-success)]";
export const STATUS_CANCELLED = "bg-[var(--bg-muted)] text-[var(--text-muted)]";

export const APPOINTMENT_CANCEL =
  "px-3.5 py-2 border border-[var(--text-danger)] rounded-lg bg-transparent text-[var(--text-danger)] text-[13px] font-semibold cursor-pointer hover:bg-[var(--bg-hover)] max-md:w-full";

export const SCHEDULE_EMPTY =
  "max-w-[760px] px-5 py-10 text-center bg-[var(--bg-surface)] border border-dashed border-[var(--border)] rounded-[14px] text-[var(--text-muted)]";
export const SCHEDULE_LINK =
  "inline-block mt-3.5 px-[18px] py-2.5 rounded-lg bg-[var(--primary)] text-[var(--text-on-primary)] text-sm font-semibold no-underline hover:bg-[var(--primary-hover)]";
