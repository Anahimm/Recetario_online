import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { iniciarSesion as loginAPI } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import styles from './login.module.css';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';

export const Login = () => {
    const navigate = useNavigate();
    const { iniciarSesion } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const respuesta = await loginAPI({
                email: formData.email,
                password: formData.password
            });
            const nombreUsuario = respuesta.usuario?.nombre || 'Chef';
            iniciarSesion(nombreUsuario, respuesta.token);

            Swal.fire({
                title: '¡Éxito!',
                text: `¡Bienvenida/o de vuelta, ${nombreUsuario}!`,
                icon: 'success',
                confirmButtonText: 'Empezar a cocinar',
                confirmButtonColor: '#3085d6'
            });
            navigate('/mis-recetas');

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Error de conexión desconocido');
            }
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.inputContainer}>
                    <span>
                        <Mail size={20} />
                    </span>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="Correo Electrónico"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.inputContainer}>
                    <span>
                        <Lock size={20} />
                    </span>
                    <input
                        type={mostrarPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        placeholder="Contraseña"
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="button"
                        className={styles.btnOjito}
                        onClick={() => setMostrarPassword(!mostrarPassword)}
                        aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        {mostrarPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                </div>

                <button type="submit">Entrar</button>
                <p className={styles.linkText}>
                    ¿No tenés cuenta? <Link to="/registro">Registrate acá</Link>
                </p>
            </form>
        </div>
    );
};