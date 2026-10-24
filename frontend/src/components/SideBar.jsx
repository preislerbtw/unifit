import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Dumbbell,
  ClipboardList,
  GraduationCap,
  CalendarDays,
  CircleUserRound,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Home,
  Sun,
  Moon,
  LayoutDashboard,
  Inbox,
  Users,
  MessageCircle,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { getSession, clearSession } from "../services/session";
import logo from "../assets/logo.png";

// menu do aluno
const STUDENT_NAV = [
  { label: "Menu", to: "/home", icon: Home },
  { label: "Exercícios", to: "/exercicios", icon: Dumbbell },
  { label: "Fichas", to: "/fichas", icon: ClipboardList },
  { label: "Professores", to: "/professores", icon: GraduationCap },
  { label: "Agenda", to: "/agenda", icon: CalendarDays },
  { label: "Chat", to: "/chat", icon: MessageCircle },
];

// menu do professor/admin
const STAFF_NAV = [
  { label: "Painel", to: "/painel", icon: LayoutDashboard },
  { label: "Solicitações", to: "/solicitacoes", icon: Inbox },
  { label: "Alunos", to: "/alunos", icon: Users },
  { label: "Chat", to: "/chat", icon: MessageCircle },
  { label: "Exercícios", to: "/exercicios", icon: Dumbbell },
];

// estrutura (sem cor/fundo/opacidade, para não conflitar com os estados)
const SIDEBAR_LINK_BASE =
  "flex items-center gap-3 border-none rounded-[10px] text-sm font-medium no-underline whitespace-nowrap cursor-pointer transition-[background,color,opacity] duration-200";

// estado normal
const SIDEBAR_LINK_INACTIVE =
  "bg-transparent text-[var(--text-on-primary)] opacity-85 hover:bg-white/[0.14] hover:opacity-100";

// estado ativo
const SIDEBAR_LINK_ACTIVE =
  "bg-[var(--bg-surface)] text-[var(--text-primary)] opacity-100";

function SideBar() {
  const navigate = useNavigate();
  const { tema, alternarTema } = useTheme();
  const [collapsed, setCollapsed] = useState(false); // desktop: só ícones
  const [mobileOpen, setMobileOpen] = useState(false); // mobile: gaveta

  const session = getSession();
  const navItems = session.role === "aluno" ? STUDENT_NAV : STAFF_NAV;

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    clearSession();
    navigate("/", { replace: true });
  };

  const temaEscuro = tema === "dark";
  const hideLabel = collapsed ? "md:hidden" : "";
  const collapsedLinkSize = collapsed ? "md:w-11 md:h-11 md:p-0 md:justify-center" : "";

  const linkClass = ({ isActive }) =>
    `${SIDEBAR_LINK_BASE} w-full px-3 py-2.5 ${collapsedLinkSize} ${
      isActive ? SIDEBAR_LINK_ACTIVE : SIDEBAR_LINK_INACTIVE
    }`;

  const buttonClass = `${SIDEBAR_LINK_BASE} ${SIDEBAR_LINK_INACTIVE} px-3 py-2.5 ${collapsedLinkSize}`;

  return (
    <>
      {/* botão de menu (aparece só no mobile) */}
      <button
        className="grid md:hidden place-items-center fixed top-3 left-3 w-10 h-10 border-none rounded-[10px] bg-[var(--primary)] text-[var(--text-on-primary)] cursor-pointer z-[100] shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu size={22} />
      </button>

      {/* fundo escurecido atrás da gaveta (mobile) */}
      {mobileOpen && (
        <div
          className="hidden max-md:block fixed inset-0 bg-black/45 z-[150]"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`flex flex-col gap-1 py-4 px-3 h-screen shrink-0 overflow-hidden z-[200] bg-[var(--sidebar-bg)] text-[var(--text-on-primary)] sticky top-0 w-60 transition-[width] duration-[250ms] ease-in-out max-md:fixed max-md:top-0 max-md:left-0 max-md:transition-transform max-md:duration-[250ms] max-md:ease-in-out ${
          mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"
        } ${collapsed ? "md:w-[72px] md:items-center" : ""}`}
      >
        <div
          className={`flex items-center justify-between gap-2 mb-4 min-h-9 ${
            collapsed ? "md:flex-col md:gap-3" : ""
          }`}
        >
          <div
            className={`flex items-center gap-2.5 pl-2 whitespace-nowrap ${
              collapsed ? "md:pl-0" : ""
            }`}
          >
            <img src={logo} alt="UniFit" className="h-7 w-auto brightness-0 invert" />
            <span className={`font-bold text-lg ${hideLabel}`}>UniFit</span>
          </div>
          <button
            className="hidden md:grid place-items-center w-7 h-7 shrink-0 border-none rounded-full bg-white/[0.18] text-[var(--text-on-primary)] cursor-pointer hover:bg-white/30"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <span className={`mx-3 mt-2 mb-1 text-[11px] tracking-[0.1em] uppercase opacity-65 whitespace-nowrap ${hideLabel}`}>
          Navegação
        </span>
        <nav className={`flex flex-col gap-1 ${collapsed ? "md:items-center" : ""}`}>
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={linkClass}
              title={collapsed ? label : undefined}
              onClick={closeMobile}
            >
              <Icon size={18} className="shrink-0" />
              <span className={`whitespace-nowrap ${hideLabel}`}>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={`flex flex-col gap-1 mt-auto ${collapsed ? "md:items-center" : ""}`}>
          <span className={`mx-3 mt-2 mb-1 text-[11px] tracking-[0.1em] uppercase opacity-65 whitespace-nowrap ${hideLabel}`}>
            Conta
          </span>

          <NavLink
            to="/Perfil"
            className={linkClass}
            title={collapsed ? "Perfil" : undefined}
            onClick={closeMobile}
          >
            <CircleUserRound size={18} className="shrink-0" />
            <span className={`whitespace-nowrap ${hideLabel}`}>Perfil</span>
          </NavLink>

          <button
            className={`${buttonClass} w-auto self-start`}
            onClick={alternarTema}
            title={collapsed ? (temaEscuro ? "Tema claro" : "Tema escuro") : undefined}
          >
            {temaEscuro ? <Sun size={18} className="shrink-0" /> : <Moon size={18} className="shrink-0" />}
            <span className={`whitespace-nowrap ${hideLabel}`}>
              {temaEscuro ? "Tema Claro" : "Tema Escuro"}
            </span>
          </button>

          <button
            className={`${buttonClass} w-full`}
            onClick={handleLogout}
            title={collapsed ? "Sair" : undefined}
          >
            <LogOut size={18} className="shrink-0" />
            <span className={`whitespace-nowrap ${hideLabel}`}>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default SideBar;