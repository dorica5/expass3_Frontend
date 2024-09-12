import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Create from "./Create";
import SignUp from "./SignUp";
import Login from "./Login";
import React, { useState, useEffect } from "react";

interface PrivateRouteProps {
  children: React.ReactNode;
}
interface User {
  id: string;
  username: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
  return loggedInUser ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser) {
      setLoggedInUser(storedUser);
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={loggedInUser ? <Home /> : <Navigate to="/signup" />}
      />
      <Route
        path="/create"
        element={
          <PrivateRoute>
            <Create />
          </PrivateRoute>
        }
      />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/login"
        element={<Login setLoggedInUser={setLoggedInUser} />}
      />
    </Routes>
  );
};

export default App;
