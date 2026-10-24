import iconUnifor from "../assets/unifor-icone-footer.svg";

function Footer() {
  return (
    <footer className="flex items-center justify-between px-10 py-6 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="flex-1 text-center text-[13px] text-[var(--text-muted)]">
        <strong className="text-[var(--text-secondary)] text-sm">UniFit</strong>
        <p>Fundação Edson Queiroz - Universidade de Fortaleza</p>
      </div>

      <div className="flex items-center gap-2.5">
        <img src={iconUnifor} alt="Unifor" className="h-8 w-auto" />
        <span className="font-bold text-[var(--text-primary)] text-[15px]">|</span>
        <span className="font-bold text-[var(--text-primary)] text-[15px]">UniFit</span>
      </div>
    </footer>
  );
}

export default Footer;
