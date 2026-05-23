import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrarUsuario } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import styles from './formulario.module.css';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2'; 

export const Registro = () => {
    const navigate = useNavigate();
    const { iniciarSesion } = useAuth();
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmarPassword: ''
    });

    const [error, setError] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmarPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const respuesta = await registrarUsuario({
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                password: formData.password,
                confirmarPassword: formData.confirmarPassword 
            });

            if (respuesta && respuesta.token) {
                iniciarSesion(formData.nombre, respuesta.token);
                Swal.fire({
                    title: '¡Bienvenida/o!',
                    text: `Cuenta creada con éxito, ${formData.nombre}.`,
                    icon: 'success',
                    confirmButtonColor: '#ff6b00'
                });
                navigate('/mis-recetas');
            } else {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Usuario creado con éxito. Por favor, iniciá sesión.',
                    icon: 'success',
                    confirmButtonColor: '#ff6b00'
                });
                navigate('/login');
            }

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
                <h2>Crear Cuenta</h2>
                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.inputContainer}>
                    <span><User size={20} /></span>
                    <input type="text" name="nombre" value={formData.nombre} placeholder="Nombre" onChange={handleChange} required />
                </div>

                <div className={styles.inputContainer}>
                    <span><User size={20} /></span>
                    <input type="text" name="apellido" value={formData.apellido} placeholder="Apellido" onChange={handleChange} required />
                </div>

                <div className={styles.inputContainer}>
                    <span><Mail size={20} /></span>
                    <input type="email" name="email" value={formData.email} placeholder="Correo Electrónico" onChange={handleChange} required />
                </div>

                <div className={styles.inputContainer}>
                    <span><Lock size={20} /></span>
                    <input 
                        type={mostrarPassword ? "text" : "password"} 
                        name="password" 
                        value={formData.password} 
                        placeholder="Contraseña" 
                        minLength={6} 
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

                <div className={styles.inputContainer}>
                    <span><Lock size={20} /></span>
                    <input 
                        type={mostrarConfirmarPassword ? "text" : "password"} 
                        name="confirmarPassword" 
                        value={formData.confirmarPassword} 
                        placeholder="Repetir Contraseña" 
                        minLength={6} 
                        onChange={handleChange} 
                        required 
                    />
                    <button
                        type="button"
                        className={styles.btnOjito}
                        onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
                        aria-label={mostrarConfirmarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        {mostrarConfirmarPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                </div>
                <button type="submit" className="btn btnNormal btnNaranja">Registrarse</button>
                
                <p className={styles.linkText}>
                    ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión acá</Link>
                </p>
            </form>
        </div>
    );
};