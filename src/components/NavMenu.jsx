import { Link } from "react-router-dom";
import UserContext from "../context/user/UserContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";


const NavMenu = () => {

  const { user } = useContext(UserContext);



  if (!user.login) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="navmenu__container">
        <div className="navmenu">
          <h1 className="navmenu__tittle-page">
            Apptelink <b>Reto</b>
          </h1>
          <h2>
            Bienvenido, <span>{user.data.name_User}</span>
          </h2>
          <h3>Menú</h3>
          <ul>
            <li>
              <Link className="navmenu__link" to="/inicio">
                <i class="navmenu__icon bx bxs-home"></i>
                <p>Inicio</p>
              </Link>
            </li>
            <li>
              <Link className="navmenu__link" to="/clientes">
                <i class="navmenu__icon bx bxs-user"></i>
               <p>Clientes</p> 
              </Link>
            </li>
            <li>
              <Link className="navmenu__link" to="/productos">
                <i class="navmenu__icon bx bxs-package"></i>
                <p>Productos</p> 
              </Link>
            </li>
            <li>
              <Link className="navmenu__link" to="/facturas">
                <i class="navmenu__icon bx bxs-note"></i>
                <p>Facturas</p> 
              </Link>
            </li>
            <li>
              <Link className="navmenu__link" to="/logout">
                <i class="navmenu__icon bx bx-log-out"></i>
                <p>Cerrar Sesión</p> 
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavMenu;
