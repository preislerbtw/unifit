import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/NavBar.css";
import logo from "../assets/logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    { label: "Exercícios", to: "/exercicios" },
    { label: "Fichas", to: "/fichas" },
    { label: "Professores", to: "/professores" },
    { label: "Agenda", to: "/agenda" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="UniFit" className="navbar-logo" />
        <span className="navbar-title">UniFit</span>
      </div>
      <ul className="navbar-links">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                isActive ? "navbar-link active" : "navbar-link"
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="navbar-right">
        <div className="navbar-profile">
          <button
            className="navbar-profile-btn"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            Perfil ▾
          </button>
          {profileOpen && (
            <div className="navbar-dropdown">
              <NavLink to="/Perfil">Meu Perfil</NavLink>
              <NavLink to="/historico">Histórico</NavLink>
              <button className="navbar-logout">Sair</button>
            </div>
          )}
        </div>
        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>
      {menuOpen && (
        <ul className="navbar-mobile-menu">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} onClick={() => setMenuOpen(false)}>
                {item.label}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to="/Perfil" onClick={() => setMenuOpen(false)}>
              perfil
            </NavLink>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;