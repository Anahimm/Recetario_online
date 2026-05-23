import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RutaProtegida = () => {
    const { isAuthenticated, cargando } = useAuth();

    // Mientras el AuthContext desencripta y verifica el token, mostramos algo genérico
    if (cargando) return <div>Verificando seguridad...</div>;

    // Si terminó de cargar y no está autenticado, lo pateamos al Login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si está todo OK, lo dejamos ver el componente hijo (ej: MisRecetas)
    return <Outlet />;
};