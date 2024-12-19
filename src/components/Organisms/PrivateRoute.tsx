import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "./AuthContext";

const PrivateRoute: React.FC = () => {
  const { user } = useContext(AuthContext);

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
