const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/recetas`;

export const obtenerMisRecetas = async () => {
    const token = localStorage.getItem('token');

    const respuesta = await fetch(`${API_URL}/mis-recetas`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(data.error || 'Error al obtener recetas');
    }
    return data;
};

export interface IngredienteItem {
    nombre: string;
    cantidad: string;
}

export interface DatosNuevaReceta {
    titulo: string;
    descripcion: string;
    ingredientes: IngredienteItem[];
    imagen_url?: string;
}

export const crearReceta = async (datos: DatosNuevaReceta) => {
    const token = localStorage.getItem('token');
    const respuesta = await fetch(`${API_URL}/crear`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datos)
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(data.error || 'Error al crear la receta');
    }

    return data;
};

export const actualizarReceta = async (id: number, datos: DatosNuevaReceta) => {
    const token = localStorage.getItem('token');

    const respuesta = await fetch(`${API_URL}/editar/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datos)
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(data.error || 'Error al actualizar la receta');
    }

    return data;
};

export const eliminarReceta = async (id: number) => {
    const token = localStorage.getItem('token');
    const respuesta = await fetch(`${API_URL}/eliminar/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(data.error || 'Error al eliminar la receta');
    }

    return data;
};

export const obtenerRecetaPublica = async (id: string) => {
    const respuesta = await fetch(`${API_URL}/publicas/${id}`, {
        method: 'GET'
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(data.error || 'Error al obtener la receta pública');
    }

    return data;
};

export const obtenerMuroPublico = async () => {
    const respuesta = await fetch(`${API_URL}/publicas`, {
        method: 'GET'
    });

    const data = await respuesta.json();
    if (!respuesta.ok) {
        throw new Error(data.error || 'Error al obtener el muro público');
    }

    return data;
};

export const enviarCalificacion = async (recetaId: number, puntaje: number, token: string) => {
    const respuesta = await fetch(`${API_URL}/calificar/${recetaId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ puntaje })
    });

    const data = await respuesta.json();
    if (!respuesta.ok) {
        throw new Error(data.error || 'Error al enviar la calificación');
    }

    return data;
};