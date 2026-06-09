import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
    nombreUsuario: string | null;
    isAuthenticated: boolean;
    cargando: boolean;
    iniciarSesion: (nombre: string, token: string) => void;
    cerrarSesion: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const tokenEsValido = (token: string | null): boolean => {
    if (!token) return false;
    try {
        const payloadBase64 = token.split('.')[1];
        const payloadDecodificado = JSON.parse(atob(payloadBase64));
        const tiempoActual = Math.floor(Date.now() / 1000);
        return payloadDecodificado.exp > tiempoActual;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return false;
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    
    // Lazy Initialization: React ejecuta esta función SOLO la primera vez que carga la app.
    const [nombreUsuario, setNombreUsuario] = useState<string | null>(() => {
        const token = localStorage.getItem('token');
        if (tokenEsValido(token)) {
            return localStorage.getItem('nombreUsuario');
        }
        // Si no es válido, limpiamos basura por las dudas
        localStorage.removeItem('token');
        localStorage.removeItem('nombreUsuario');
        return null;
    });

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return tokenEsValido(localStorage.getItem('token'));
    });

    // Como leímos todo instantáneamente de forma síncrona, ya no hay "tiempo de carga"
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [cargando, _setCargando] = useState<boolean>(false);

    const iniciarSesion = (nombre: string, token: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('nombreUsuario', nombre);
        setNombreUsuario(nombre);
        setIsAuthenticated(true);
    };

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('nombreUsuario');
        setNombreUsuario(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ nombreUsuario, isAuthenticated, cargando, iniciarSesion, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth tiene que ser usado adentro de un AuthProvider");
    }
    return context;
};