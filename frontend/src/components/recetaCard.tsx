import styles from '../pages/misRecetas.module.css';
import { Calificador } from './calificador';

export interface Receta {
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
    usuario_id: number;
    usuario?: { nombre: string; apellido: string };
    calificaciones?: { puntaje: number }[];
}

interface RecetaCardProps {
    receta: Receta;
    onEditar?: () => void;
    onEliminar?: () => void;
    onCopiar?: () => void;
    esPublica?: boolean;
    onVotar?: (puntaje: number) => void;
}

export const RecetaCard = ({ receta, onEditar, onEliminar, onCopiar, esPublica, onVotar }: RecetaCardProps) => {
    const totalVotos = receta.calificaciones?.length || 0;
    const suma = receta.calificaciones?.reduce((acc, c) => acc + c.puntaje, 0) || 0;
    const promedio = totalVotos > 0 ? Math.round(suma / totalVotos) : 0;
    
    return (
        <article className={styles.card}>
            {receta.imagen_url && (
                <div className={styles.imageWrapper}>
                    <img
                        src={receta.imagen_url}
                        alt={receta.titulo}
                        onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?auto=format&fit=crop&w=500&q=80';
                        }}
                    />
                </div>
            )}
            
            <div className={styles.cardBody}>
                <span className={styles.fecha}>
                    {new Date(receta.fecha_creacion).toLocaleDateString()}
                </span>
                
                <h3>{receta.titulo}</h3>
                
                {esPublica && receta.usuario && (
                    <p className={styles.autor}>
                        👨‍🍳 Por: {receta.usuario.nombre} {receta.usuario.apellido}
                    </p>
                )}
                
                <p className={styles.descripcion}>{receta.descripcion}</p>
                
                <div className={styles.detalles}>
                    <strong>Ingredientes:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--color-texto-secundario)' }}>
                        {receta.ingredientes?.map((item, index) => (
                            <li key={index} style={{ textTransform: 'capitalize' }}>
                                <strong>{item.cantidad}</strong> de {item.ingrediente.nombre}
                            </li>
                        ))}
                    </ul>
                </div>

                {esPublica ? (
                    <div className={styles.contenedorCalificacion}>
                        <p className={styles.tituloCalificacion}>CALIFICACIÓN:</p>
                        <Calificador
                            puntaje={promedio}
                            onCalificar={(valor) => onVotar && onVotar(valor)}
                        />
                        <small className={styles.textoCalificaciones}>
                            {totalVotos} calificaciones
                        </small>
                    </div>
                ) : (
                    <div className={styles.accionesReceta}>
                        <button onClick={onEditar} className="btn btnChico btnOutlineAzul">
                            Editar
                        </button>
                        <button onClick={onEliminar} className="btn btnChico btnOutlineNaranja">
                            Eliminar
                        </button>
                        <button onClick={onCopiar} className="btn btnChico btnGris">
                            🔗 Copiar Link
                        </button>
                    </div>
                )}
            </div>
        </article>
    );
};