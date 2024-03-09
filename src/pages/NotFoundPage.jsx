import { Navigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../context/user/UserContext";

const NotFoundPage = () => {
    
  const { user } = useContext(UserContext);

  if (!user.login) {
    console.log(user);
  }

  return (
    <>
      <h1>404 Página no encontrada</h1>
      

    </>
  );
};

export default NotFoundPage;
