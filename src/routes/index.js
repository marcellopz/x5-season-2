import React, { useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../contexts/navbar/Navbar";

export default function PrivateRoutes() {
  const { signed, loading } = useContext(AuthContext);

  if (loading) {
    return <div>loading</div>;
  }

  return signed ? <Outlet /> : <Navigate to="auth/login" />;
}

export function NavbarRoutes() {
  return (
    <Navbar>
      <Outlet />
    </Navbar>
  );
}
