import "../styles/Perfil.css";
import { CircleUserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { getSession } from "../services/session";

function Perfil() {
  const navigate = useNavigate();

  const dadosUsuario = getUsuario();

  const usuario = {
    nome: dadosUsuario.nome,
    curso: dadosUsuario.curso,
    matricula: dadosUsuario.matricula,
    email: dadosUsuario.email,
    peso: dadosUsuario.peso,
    altura: dadosUsuario.altura,
  };

  return (
    <div className="perfil-page">
      <div className="perfil-avatar">
        <CircleUserRound className="icone-perfil" />
      </div>

      <div className="perfil-dados">
        <div className="dado-box">
          <span className="dado-label">Nome</span>
          <span className="dado-valor">{usuario.name || "—"}</span>
        </div>

        {usuario.curso && (
          <div className="dado-box">
            <span className="dado-label">Curso</span>
            <span className="dado-valor">{usuario.curso}</span>
          </div>
        )}

        {usuario.matricula && (
          <div className="dado-box">
            <span className="dado-label">Matrícula</span>
            <span className="dado-valor">{usuario.matricula}</span>
          </div>
        )}

        {usuario.email && (
          <div className="dado-box">
            <span className="dado-label">Email</span>
            <span className="dado-valor">{usuario.email}</span>
          </div>
        )}

        {usuario.peso != null && (
          <div className="dado-box">
            <span className="dado-label">Peso</span>
            <span className="dado-valor">{usuario.peso} KG</span>
          </div>
        )}

        {usuario.altura != null && (
          <div className="dado-box">
            <span className="dado-label">Altura</span>
            <span className="dado-valor">
              {Number(usuario.altura).toFixed(2)} M
            </span>
          </div>
        )}
        {usuario.idUsuario != null && (
          <div className="dado-box">
            <span className="dado-label">ID do Usuário</span>
            <span className="dado-valor">
              {String(usuario.idUsuario).padStart(4, "0")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Perfil;
