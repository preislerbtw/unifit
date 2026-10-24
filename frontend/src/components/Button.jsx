const variantClasses = {
  soft:
    "px-[1.7em] py-[0.7em] text-lg font-normal rounded-lg text-[var(--btn-soft-text)] bg-[var(--btn-soft-bg)] border border-[var(--btn-soft-border)] shadow-[6px_6px_12px_var(--neu-dark),-6px_-6px_12px_var(--neu-light)] enabled:hover:border-[var(--btn-soft-bg)] enabled:active:shadow-[4px_4px_12px_var(--neu-light),-4px_-4px_12px_var(--neu-light)]",
};

function Button({ children, variant = "primary", className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      className={`border-none rounded-lg px-5 py-2.5 text-[15px] font-semibold cursor-pointer shadow-none transition-all duration-300 ${variantClasses[variant] || ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
