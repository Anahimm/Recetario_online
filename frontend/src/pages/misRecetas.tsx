import { useEffect, useState } from 'react';
import { obtenerMisRecetas, crearReceta, actualizarReceta, eliminarReceta, type IngredienteItem } from '../services/recetas.service';
import { RecetaCard, type Receta } from '../components/recetaCard';
import { RecetaModal } from '../components/recetaModal';
import styles from './misRecetas.module.css';
import Swal from 'sweetalert2'; 

const ESTADO_INICIAL_RECETA = {
    titulo: '',
    descripcion: '',
    ingredientes: [{ nombre: '', cantidad: '' }], 
    imagen_url: ''
};

export const MisRecetas = () => {
    const [recetas, setRecetas] = useState<Receta[]>([]);
    const [cargando, setCargando] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recetaEditandoId, setRecetaEditandoId] = useState<number | null>(null);
    const [nuevaReceta, setNuevaReceta] = useState(ESTADO_INICIAL_RECETA);

    const nombre = localStorage.getItem('nombreUsuario');

    const cargarRecetas = async () => {
        try {
            const data = await obtenerMisRecetas();
            setRecetas(data);
        } catch (error) {
            console.error("Error al cargar recetas:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        cargarRecetas();
    }, []);

    const abrirModalCrear = () => {
        setRecetaEditandoId(null);
        setNuevaReceta(ESTADO_INICIAL_RECETA);
        setIsModalOpen(true);
    };

    const abrirModalEditar = (receta: Receta) => {
        setRecetaEditandoId(receta.id);
        
        const ingredientesFormateados = receta.ingredientes?.map(item => ({
            nombre: item.ingrediente.nombre,
            cantidad: item.cantidad
        })) || [{ nombre: '', cantidad: '' }];

        setNuevaReceta({
            titulo: receta.titulo,
            descripcion: receta.descripcion,
            ingredientes: ingredientesFormateados,
            imagen_url: receta.imagen_url || ''
        });
        setIsModalOpen(true);
    };

    const cerrarModal = () => {
        setIsModalOpen(false);
        setRecetaEditandoId(null);
        setNuevaReceta(ESTADO_INICIAL_RECETA);
    };

    const handleEliminar = async (id: number) => {
        const result = await Swal.fire({
            title: '¿Estás segura?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff4d4f',
            cancelButtonColor: '#9e9e9e',
            confirmButtonText: 'Sí, borrar receta',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await eliminarReceta(id);
                cargarRecetas();
                Swal.fire('¡Eliminada!', 'Tu receta ha sido borrada.', 'success');
            } catch (error) {
                Swal.fire('Error', 'Hubo un problema al eliminar la receta', 'error');
                console.error(error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (recetaEditandoId) {
                await actualizarReceta(recetaEditandoId, nuevaReceta);
                Swal.fire('¡Actualizada!', 'Tu receta ha sido guardada', 'success');
            } else {
                await crearReceta(nuevaReceta);
                Swal.fire('¡Creada!', 'Tu nueva receta ya está en tu muro', 'success');
            }
            cerrarModal();
            cargarRecetas();
        } catch (error) {
            Swal.fire('Error', recetaEditandoId ? "Error al editar la receta" : "Hubo un error al crear la receta", 'error');
            console.error(error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNuevaReceta({ ...nuevaReceta, [e.target.name]: e.target.value });
    };

    const handleIngredientChange = (index: number, campo: keyof IngredienteItem, valor: string) => {
        const nuevosIngredientes = [...nuevaReceta.ingredientes];
        nuevosIngredientes[index][campo] = valor;
        setNuevaReceta({ ...nuevaReceta, ingredientes: nuevosIngredientes });
    };

    const handleAddIngredient = () => {
        setNuevaReceta({
            ...nuevaReceta,
            ingredientes: [...nuevaReceta.ingredientes, { nombre: '', cantidad: '' }]
        });
    };

    const handleRemoveIngredient = (index: number) => {
        const nuevosIngredientes = nuevaReceta.ingredientes.filter((_, i) => i !== index);
        setNuevaReceta({ ...nuevaReceta, ingredientes: nuevosIngredientes });
    };

    const copiarLinkPublico = (id: number) => {
        const urlPublica = `${window.location.origin}/receta/${id}`;
        navigator.clipboard.writeText(urlPublica)
            .then(() => {
                Swal.fire({
                    toast: true,
                    position: 'bottom-end',
                    icon: 'success',
                    title: 'Link copiado al portapapeles',
                    showConfirmButton: false,
                    timer: 3000
                });
            })
            .catch(err => {
                console.error("Error al copiar:", err);
            });
    };

    if (cargando) return <div className={styles.loader}>Cargando tu recetario...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerInfo}>
                <h1>¡Hola, {nombre || 'Chef'}! 👩‍🍳</h1>
                <p>Acá podés gestionar todas tus recetas</p>
                </div>
                <button className="btn btnNormal btnNaranja" onClick={abrirModalCrear}>
                    + Crear Receta
                </button>
            </header>

            {recetas.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>Todavía no tenés recetas cargadas... 😔</p>
                </div>
            ) : (
                <div className={styles.gridRecetas}>
                    {recetas.map(receta => (
                        <RecetaCard
                            key={receta.id}
                            receta={receta}
                            onEditar={() => abrirModalEditar(receta)}
                            onEliminar={() => handleEliminar(receta.id)}
                            onCopiar={() => copiarLinkPublico(receta.id)}
                        />
                    ))}
                </div>
            )}

            <RecetaModal
                isOpen={isModalOpen}
                onClose={cerrarModal}
                onSubmit={handleSubmit}
                isEditing={!!recetaEditandoId}
                nuevaReceta={nuevaReceta}
                onChange={handleChange}
                onIngredientChange={handleIngredientChange}
                onAddIngredient={handleAddIngredient}
                onRemoveIngredient={handleRemoveIngredient}
            />
        </div>
    );
};