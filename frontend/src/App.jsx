import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Perfil from "./pages/Perfil";
import ExerciseDetail from "./pages/ExerciseDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Exercises from "./pages/Exercises";
import Register from "./pages/Register";
import Professors from "./pages/Professors";
import Schedule from "./pages/Schedule";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/exercicios" element={<Exercises />} />
          <Route path="/exercicios/:id" element={<ExerciseDetail />} />
          <Route path="/professores" element={<Professors />} />
          <Route path="/agenda" element={<Schedule />} />
          <Route path="/Perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;