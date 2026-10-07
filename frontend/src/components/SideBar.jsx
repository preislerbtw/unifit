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
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import logo from "../assets/logo.png";
import "../styles/SideBar.css";

const navItems = [
  { label: "Menu", to: "/home", icon: Home },
  { label: "Exercícios", to: "/exercicios", icon: Dumbbell },
  { label: "Fichas", to: "/fichas", icon: ClipboardList },
  { label: "Professores", to: "/professores", icon: GraduationCap },
  { label: "Agenda", to: "/agenda", icon: CalendarDays },
];

function SideBar() {
  const navigate = useNavigate();
  const { tema, alternarTema } = useTheme();
  const [collapsed, setCollapsed] = useState(false); // desktop: só ícones
  const [mobileOpen, setMobileOpen] = useState(false); // mobile: gaveta

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    sessionStorage.removeItem("logado");
    sessionStorage.removeItem("usuario_logado");
    localStorage.removeItem("logado");
    localStorage.removeItem("usuario_logado");
    navigate("/", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  const temaEscuro = tema === "dark";

  return (
    <>
      {/* botão de menu (aparece só no mobile) */}
      <button
        className="sidebar-mobile-btn"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu size={22} />
      </button>

      {/* fundo escurecido atrás da gaveta (mobile) */}
      {mobileOpen && <div className="sidebar-overlay" onClick={closeMobile} />}

      <aside
        className={`sidebar ${collapsed ? "is-collapsed" : ""} ${
          mobileOpen ? "is-open" : ""
        }`}
      >
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img src={logo} alt="UniFit" className="sidebar-logo" />
            <span className="sidebar-title sidebar-label">UniFit</span>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <span className="sidebar-section sidebar-label">Navegação</span>
        <nav className="sidebar-nav">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={linkClass}
              title={collapsed ? label : undefined}
              onClick={closeMobile}
            >
              <Icon size={18} />
              <span className="sidebar-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="sidebar-section sidebar-label">Conta</span>

          <NavLink
            to="/Perfil"
            className={linkClass}
            title={collapsed ? "Perfil" : undefined}
            onClick={closeMobile}
          >
            <CircleUserRound size={18} />
            <span className="sidebar-label">Perfil</span>
          </NavLink>

          <button
            className="sidebar-link"
            onClick={alternarTema}
            title={collapsed ? (temaEscuro ? "Tema claro" : "Tema escuro") : undefined}
          >
            {temaEscuro ? <Sun size={18} /> : <Moon size={18} />}
            <span className="sidebar-label">
              {temaEscuro ? "Tema Claro" : "Tema Escuro"}
            </span>
          </button>

          <button
            className="sidebar-link"
            onClick={handleLogout}
            title={collapsed ? "Sair" : undefined}
          >
            <LogOut size={18} />
            <span className="sidebar-label">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default SideBar;