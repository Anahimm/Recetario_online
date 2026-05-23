import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './navbar.module.css';
import logoImagen from '../assets/logo_app.jpg';

export const Navbar = () => {
    const { nombreUsuario, cerrarSesion } = useAuth();

    const navigate = useNavigate();
    const handleLogout = () => {
        cerrarSesion();
        navigate('/login');
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link to={nombreUsuario ? "/mis-recetas" : "/explorar"} className={styles.logoLink}>
                <img src={logoImagen} alt="Logo" className={styles.logoImg} />
                </Link>
            </div>

            <ul className={styles.links}>
                <li><Link to="/explorar">Recetas públicas</Link></li>
                {nombreUsuario ? (
                    <>
                        <li><Link to="/mis-recetas">Mis Recetas</Link></li>
                        <li>
                            <button onClick={handleLogout} className="btn btnNormal btnNaranja">
                                Cerrar Sesión
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Iniciar Sesión</Link></li>
                        <li><Link to="/registro">Registrarse</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};