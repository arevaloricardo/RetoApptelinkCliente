import React, { useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../context/user/UserContext";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

const LogoutPage = () => {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (user && user.login) {
      setUser(null);
      cookies.remove("user");
    }
  }, [setUser]);

  return user && user.login ? null : <Navigate to="/" />;
};

export default LogoutPage;
