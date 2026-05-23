import React from 'react';
import styles from './recetaModal.module.css';
import { type IngredienteItem } from '../services/recetas.service'; 

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
                        className="input-base"
                    />
                    <textarea
                        name="descripcion" placeholder="Descripción" required
                        value={nuevaReceta.descripcion} onChange={onChange}
                        className="input-base"
                    />

                    {/* --- SECCIÓN DINÁMICA DE INGREDIENTES --- */}
                    <div>
                        <p style={{ marginBottom: '0.5rem', color: 'var(--color-texto-principal)' }}>
                            <strong>Ingredientes:</strong>
                        </p>
                        {nuevaReceta.ingredientes.map((ingrediente, index) => (
                            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Nombre (ej. Harina)"
                                    required
                                    value={ingrediente.nombre}
                                    onChange={(e) => onIngredientChange(index, 'nombre', e.target.value)}
                                    className="input-base"
                                    style={{ flex: 2 }}
                                />
                                <input
                                    type="text"
                                    placeholder="Cantidad (ej. 500g)"
                                    required
                                    value={ingrediente.cantidad}
                                    onChange={(e) => onIngredientChange(index, 'cantidad', e.target.value)}
                                    className="input-base"
                                    style={{ flex: 1 }}
                                />
                                {nuevaReceta.ingredientes.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => onRemoveIngredient(index)}
                                        className="btn btnChico"
                                        style={{ backgroundColor: 'var(--color-error)', color: 'white', border: 'none' }}
                                    >
                                        X
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button" 
                            onClick={onAddIngredient}
                            className="btn btnChico btnOutlineNaranja"
                            style={{ marginBottom: '15px' }}
                        >
                            + Agregar otro ingrediente
                        </button>
                    </div>

                    <input
                        type="url" name="imagen_url" placeholder="Link de una imagen (Opcional)"
                        value={nuevaReceta.imagen_url || ''} onChange={onChange}
                        className="input-base"
                    />

                    <div className={styles.modalBotones}>
                        <button type="button" className="btn btnNormal btnGris" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btnNormal btnNaranja">
                            {isEditing ? 'Guardar Cambios' : 'Guardar Receta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};