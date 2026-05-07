import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">✈️ AirGestion</Link>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <span>Bienvenido, {user.nombre} ({user.rol})</span>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={logout} className="btn-logout">Cerrar Sesión</button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/register" className="btn-register">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
