import { useEffect, useState } from 'react';
import styles from './misRecetas.module.css'; 
import { RecetaCard, type Receta } from '../components/recetaCard';
import { obtenerMuroPublico, enviarCalificacion } from '../services/recetas.service'; 
import Swal from 'sweetalert2';

export const Explorar = () => {
    const [recetas, setRecetas] = useState<Receta[]>([]);
    const [cargando, setCargando] = useState(true);

    const cargarMuro = async () => {
        try {
            const data = await obtenerMuroPublico();
            setRecetas(data);
        } catch (error) {
            console.error("Error al cargar el muro de recetas:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarMuro();
    }, []);

    const handleVoto = async (recetaId: number, puntaje: number) => {
        const token = localStorage.getItem('token'); 
        
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: '¡Aviso!',
                text: 'Tenés que iniciar sesión para calificar las recetas.',
                confirmButtonColor: '#F08D39'
            });
            return;
        }

        try {
            await enviarCalificacion(recetaId, puntaje, token);
            cargarMuro(); 
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Ups...',
                text: 'Hubo un error al guardar tu calificación. ¿Quizás ya votaste esta receta?',
                confirmButtonColor: '#d62828'
            });
            console.error(error);
        }
    };

    if (cargando) return <div className={styles.loader}>Cargando el muro...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerInfo}>
                    <h1>Recetas de la Comunidad</h1>
                    <p>Descubrí y calificá las mejores recetas.</p>
                </div>
            </header>

            {recetas.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>Todavía no hay recetas públicas. ¡Subí la tuya!</p>
                </div>
            ) : (
                <div className={styles.gridRecetas}>
                    {recetas.map(receta => (
                        <RecetaCard
                            key={receta.id}
                            receta={receta}
                            esPublica={true}
                            onVotar={(puntaje) => handleVoto(receta.id, puntaje)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};