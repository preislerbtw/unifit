import "../styles/Perfil.css";
import { CircleUserRound } from "lucide-react";
function Perfil() {
  const usuario = {
    nome: "Antônio Enzo",
    curso: "Ciência da Computacão",
    matricula: "2513868",
    email: "antonioenzo@edu.unifor.br",
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
      </div>
    </div>
  );
}
export default Perfil;
