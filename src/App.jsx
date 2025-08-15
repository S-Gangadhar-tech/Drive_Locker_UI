import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Pages/Layout";
import Login from "./Pages/Login";
import EmailVerify from "./Pages/EmailVerify";
import ResetPassword from "./Pages/ResetPassword";
import Home from "./Pages/Home";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
// import Notes from "./Pages/Notes";
import Files from "./Pages/Files";
import CreatePasskey from "./Pages/CreatePasskey";
import Services from "./Pages/Services";
import NotesService from "./Pages/NotesService";

// Protect routes for logged-in users only
const ProtectedRoute = ({ children }) => {
  const { isLoggedin } = useContext(AppContext);
  if (!isLoggedin) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Restrict routes to users NOT logged in (e.g., login page)
const PublicRoute = ({ children }) => {
  const { isLoggedin } = useContext(AppContext);
  if (isLoggedin) {
    // Logged in, redirect to home
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        {/* Login only for NOT logged in users */}
        <Route
          path="login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Email Verify protected, only logged-in users */}
        <Route
          path="email-verify"
          element={
            <ProtectedRoute>
              <EmailVerify />
            </ProtectedRoute>
          }
        />

        {/* Reset Password protected, only logged-in users */}
        <Route
          path="reset-password"
          element={
            <ResetPassword />
          }
        />
        <Route
          path="/Services"
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Notes"
          element={
            <ProtectedRoute>
              <NotesService />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Createpasskey"
          element={
            <ProtectedRoute>
              <CreatePasskey />
            </ProtectedRoute>
          }
        />



        <Route
          path="/Files"
          element={
            <ProtectedRoute>
              <Files />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
