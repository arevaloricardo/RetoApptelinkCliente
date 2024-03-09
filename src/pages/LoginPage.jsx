import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/user/UserContext";
import API_BASE_URL from "../hooks/APIConfig";
import Alerta from "../components/Alerta";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.login) {
      navigate("/inicio");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch(`${API_BASE_URL}/api/User/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const data = await response.json();

    if (data.message) {
      setError(data.message);
    } else {
      setError(null);
      setUser({
        login: data.login,
        data: data.data,
      });
      navigate("/inicio");
    }
  };

  return (
    <>
      <div className="login__container">
        <h1 className="login__tittle-page">
          Apptelink <b>Reto</b>
        </h1>{" "}
        <div className="login__content">
          <h1>Login</h1>

          <form className="login__formulario">
            <div className="login__input">
              <label htmlFor="username">Usuario:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="login__input">
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="button button__login" onClick={handleLogin}>
              Iniciar sesión
            </button>
          </form>
        {error && <Alerta tipo="error" texto={error} />}
        </div>
      </div>
    </>
  );
};

export default LoginPage;
