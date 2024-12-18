// PrivateRoute.tsx

import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "./AuthContext";

const PrivateRoute: React.FC = () => {
  const { user } = useContext(AuthContext);

  // You can add a loading state check here if needed

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
