import { Navigate } from "react-router-dom";
import { getSession } from "../services/session";

// Só deixa entrar quem tem um dos perfis permitidos.
function RoleRoute({ allow, children }) {
  const { role } = getSession();
  const home = role === "aluno" ? "/home" : "/painel";
  return allow.includes(role) ? children : <Navigate to={home} replace />;
}

export default RoleRoute;
