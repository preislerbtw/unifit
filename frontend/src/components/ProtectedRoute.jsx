import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const logado = sessionStorage.getItem("logado") === "true" || localStorage.getItem("logado") === "true";
  return logado ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;