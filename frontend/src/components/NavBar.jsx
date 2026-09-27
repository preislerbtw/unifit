import { useState } from 'react';
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/logo.png";

function NavBar() {
    const [menuoOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const navItems = [
        {label: "Exercícios"},
    ];
}

export default NavBar;