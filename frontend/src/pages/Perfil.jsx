import "../styles/Perfil.css";
import { CircleUserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { getUsuario } from "../utils/auth"

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
          <span className="dado-valor">{usuario.nome}</span>
        </div>

        <div className="dado-box">
          <span className="dado-label">Curso</span>
          <span className="dado-valor">{usuario.curso}</span>
        </div>

        <div className="dado-box">
          <span className="dado-label">Matrícula</span>
          <span className="dado-valor">{usuario.matricula}</span>
        </div>

        <div className="dado-box">
          <span className="dado-label">Email</span>
          <span className="dado-valor">{usuario.email}</span>
        </div>

        <div className="dado-box">
          <span className="dado-label">Peso</span>
          <span className="dado-valor">{usuario.peso != null ? `${usuario.peso} KG` : "Não Informado"}</span>
        </div>

        <div className="dado-box">
          <span className="dado-label">Altura</span>
          <span className="dado-valor">{usuario.altura != null ? `${usuario.altura} M` : "Não Informado"} </span>
        </div>
      </div>
    </div>
  );
}

export default Perfil;