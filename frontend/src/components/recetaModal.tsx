import styles from '../pages/misRecetas.module.css';
import {type IngredienteItem } from '../services/recetas.service'; 

interface RecetaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    isEditing: boolean;
    nuevaReceta: {
        titulo: string;
        descripcion: string;
        ingredientes: IngredienteItem[];
        imagen_url?: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    
    onIngredientChange: (index: number, campo: keyof IngredienteItem, valor: string) => void;
    onAddIngredient: () => void;
    onRemoveIngredient: (index: number) => void;
}

export const RecetaModal = ({ 
    isOpen, onClose, onSubmit, isEditing, nuevaReceta, onChange, 
    onIngredientChange, onAddIngredient, onRemoveIngredient 
}: RecetaModalProps) => {
    
    if (!isOpen) return null; 

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{isEditing ? 'Editar Receta' : 'Nueva Receta'}</h2>

                <form onSubmit={onSubmit} className={styles.formReceta}>
                    <input
                        type="text" name="titulo" placeholder="Título de la receta" required
                        value={nuevaReceta.titulo} onChange={onChange}
                    />
                    <textarea
                        name="descripcion" placeholder="Descripción" required
                        value={nuevaReceta.descripcion} onChange={onChange}
                    />

                    {/* --- NUEVA SECCIÓN DINÁMICA DE INGREDIENTES --- */}
                    <div className={styles.ingredientesContainer}>
                        <p><strong>Ingredientes:</strong></p>
                        {nuevaReceta.ingredientes.map((ingrediente, index) => (
                            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Nombre (ej. Harina)"
                                    required
                                    value={ingrediente.nombre}
                                    onChange={(e) => onIngredientChange(index, 'nombre', e.target.value)}
                                    style={{ flex: 2 }}
                                />
                                <input
                                    type="text"
                                    placeholder="Cantidad (ej. 500g)"
                                    required
                                    value={ingrediente.cantidad}
                                    onChange={(e) => onIngredientChange(index, 'cantidad', e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                {/* Solo mostramos el botón de borrar si hay más de 1 ingrediente */}
                                {nuevaReceta.ingredientes.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => onRemoveIngredient(index)}
                                        style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', padding: '0 10px', cursor: 'pointer' }}
                                    >
                                        X
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button" 
                            onClick={onAddIngredient}
                            style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', marginBottom: '15px' }}
                        >
                            + Agregar otro ingrediente
                        </button>
                    </div>
                    {/* ----------------------------------------------- */}

                    <input
                        type="url" name="imagen_url" placeholder="Link de una imagen (Opcional)"
                        value={nuevaReceta.imagen_url || ''} onChange={onChange}
                    />

                    <div className={styles.modalBotones}>
                        <button type="button" className={`${styles.btn} ${styles.btnNormal} ${styles.btnGris}`} onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className={`${styles.btn} ${styles.btnNormal} ${styles.btnNaranja}`}>
                            {isEditing ? 'Guardar Cambios' : 'Guardar Receta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};