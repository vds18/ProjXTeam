import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateProject from "./pages/CreateProject";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import EditProject from "./pages/EditProject";
import MatchedProjects from "./pages/MatchedProjects";
import MyProjects from "./pages/MyProjects";
import JoinRequests from "./pages/JoinRequests";
import Notifications from "./pages/Notifications";
import Chat from "./pages/Chat";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* ==============================
            PUBLIC ROUTES
        ============================== */}

        <Route
          path="/"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ==============================
            PROTECTED ROUTES
        ============================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-project"
          element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />

        {/* Project Details */}
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />
                {/* Team Chat */}
<Route
  path="/projects/:id/chat"
  element={
    <ProtectedRoute>
      <Chat />
    </ProtectedRoute>
  }
/>



        {/* Edit Project */}
        <Route
          path="/projects/:id/edit"
          element={
            <ProtectedRoute>
              <EditProject />
            </ProtectedRoute>
          }
        />

        {/* Matched Projects */}
        <Route
          path="/matched-projects"
          element={
            <ProtectedRoute>
              <MatchedProjects />
            </ProtectedRoute>
          }
        />

        {/* My Projects */}
        <Route
          path="/my-projects"
          element={
            <ProtectedRoute>
              <MyProjects />
            </ProtectedRoute>
          }
        />

        {/* Join Requests */}
        <Route
          path="/join-requests"
          element={
            <ProtectedRoute>
              <JoinRequests />
            </ProtectedRoute>
          }
        />
        {/* Notifications */}
        <Route
          path="/notifications"
          element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;