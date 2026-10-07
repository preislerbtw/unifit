import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Perfil from "./pages/Perfil";
import Exercises from "./pages/Exercises";
import ExerciseDetail from "./pages/ExerciseDetail";
import Professors from "./pages/Professors";
import Schedule from "./pages/Schedule";
import Workouts from "./pages/Workouts";
import WorkoutEditor from "./pages/WorkoutEditor";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Requests from "./pages/Requests";
import Students from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import Layout from "./components/Layout";

const STUDENT = ["aluno"];
const STAFF = ["professor", "admin"];

// atalho: protege uma página para certos perfis
const only = (roles, page) => <RoleRoute allow={roles}>{page}</RoleRoute>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* públicas (sem sidebar) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* protegidas (com sidebar) */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* todos os perfis */}
          <Route path="/exercicios" element={<Exercises />} />
          <Route path="/exercicios/:id" element={<ExerciseDetail />} />
          <Route path="/Perfil" element={<Perfil />} />

          {/* aluno */}
          <Route path="/home" element={only(STUDENT, <Home />)} />
          <Route path="/professores" element={only(STUDENT, <Professors />)} />
          <Route path="/agenda" element={only(STUDENT, <Schedule />)} />
          <Route path="/fichas" element={only(STUDENT, <Workouts />)} />
          <Route path="/fichas/nova" element={only(STUDENT, <WorkoutEditor />)} />
          <Route path="/fichas/:workoutId" element={only(STUDENT, <WorkoutEditor />)} />

          {/* aluno e professor */}
          <Route path="/chat" element={only(["aluno", "professor"], <Chat />)} />
          <Route
            path="/chat/:partnerId"
            element={only(["aluno", "professor"], <Chat />)}
          />

          {/* professor e administrador */}
          <Route path="/painel" element={only(STAFF, <Dashboard />)} />
          <Route path="/solicitacoes" element={only(STAFF, <Requests />)} />
          <Route path="/alunos" element={only(STAFF, <Students />)} />
          <Route path="/alunos/:studentId" element={only(STAFF, <StudentDetail />)} />
          <Route
            path="/alunos/:studentId/fichas/nova"
            element={only(STAFF, <WorkoutEditor />)}
          />
          <Route
            path="/alunos/:studentId/fichas/:workoutId"
            element={only(STAFF, <WorkoutEditor />)}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
