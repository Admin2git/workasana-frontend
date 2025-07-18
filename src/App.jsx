import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { TaskManageProvider } from "./contexts/TaskManageContext";
import { LoginAndSignUp } from "./pages/LoginAndSignUp";
import { Dashboard } from "./pages/Dashboard";
import { PrivateRoute } from "./components/PrivateRoute";
import { ProjectAndItsTask } from "./pages/ProjectAndItsTask";
import { TaskByProject } from "./pages/TaskByProject";
import { TaskDetails } from "./pages/TaskDetails";
import { TeamsManage } from "./pages/TeamsManage";
import { Reports } from "./pages/Reports";

function App() {
  return (
    <>
      <Router>
        <TaskManageProvider>
          <Routes>
            <Route path="/login" element={<LoginAndSignUp />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <PrivateRoute>
                  <ProjectAndItsTask />
                </PrivateRoute>
              }
            />
            <Route
              path="/taskByProject/:id"
              element={
                <PrivateRoute>
                  <TaskByProject />
                </PrivateRoute>
              }
            />
            <Route
              path="/taskDetails/:id"
              element={
                <PrivateRoute>
                  <TaskDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/teams"
              element={
                <PrivateRoute>
                  <TeamsManage />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </TaskManageProvider>
      </Router>
    </>
  );
}

export default App;
