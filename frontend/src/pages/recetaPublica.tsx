import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerRecetaPublica } from '../services/recetas.service';
import styles from './misRecetas.module.css'; 

// Actualizamos la interfaz para coincidir con la de RecetaCard
interface RecetaPublica {
    id: number;
    titulo: string;
    descripcion: string;
    ingredientes: {
        cantidad: string;
        ingrediente: {
            nombre: string;
        };
    }[];
    imagen_url?: string;
    fecha_creacion: string;
    usuario: {
        nombre: string;
        apellido: string;
    };
}

export const RecetaPublica = () => {
    const { id } = useParams<{ id: string }>(); 
    const [receta, setReceta] = useState<RecetaPublica | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarReceta = async () => {
            if (!id) return;
            try {
                const data = await obtenerRecetaPublica(id);
                setReceta(data);
            } catch (err) {
                if (err instanceof Error) setError(err.message);
            } finally {
                setCargando(false);
            }
        };
        cargarReceta();
    }, [id]);

    if (cargando) return <div className={styles.loader}>Cargando receta...</div>;
    
    if (error || !receta) return (
        <div className={`${styles.container} ${styles.errorContainer}`}>
            <h2>Ups, no encontramos esta receta 😕</h2>
            <p>{error}</p>
            <Link to="/" className={`${styles.btn} ${styles.btnNormal} ${styles.btnNaranja}`}>Ir al inicio</Link>
        </div>
    );

    return (
        <div className={styles.containerDetail}>
            <article className={styles.card}>
                {receta.imagen_url && (
                    <div className={styles.detailImageWrapper}>
                        <img 
                            src={receta.imagen_url} 
                            alt={receta.titulo} 
                        />
                    </div>
                )}
                
                <div className={styles.detailBody}>
                    <h1 className={styles.detailTitle}>
                        {receta.titulo}
                    </h1>
                    
                    <p className={styles.detailMeta}>
                        👨‍🍳 Creado por: <strong>{receta.usuario.nombre} {receta.usuario.apellido}</strong> <br/>
                        📅 {new Date(receta.fecha_creacion).toLocaleDateString()}
                    </p>

                    <h3 className={styles.sectionTitle}>Descripción</h3>
                    <p className={styles.detailText}>
                        {receta.descripcion}
                    </p>

                    <h3 className={styles.sectionTitle}>Ingredientes</h3>
                    <div className={styles.ingredientsBox}>
                        {/* --- RENDERIZADO DE LA LISTA RELACIONAL --- */}
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {receta.ingredientes?.map((item, index) => (
                                <li key={index} style={{ marginBottom: '8px', textTransform: 'capitalize' }}>
                                    <strong>{item.cantidad}</strong> de {item.ingrediente.nombre}
                                </li>
                            ))}
                        </ul>
                        {/* ------------------------------------------ */}
                    </div>
                </div>
            </article>
        </div>
    );
};