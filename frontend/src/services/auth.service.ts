interface DatosRegistro {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
}


const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/auth`;

export const registrarUsuario = async (datos: DatosRegistro) => {
    const respuesta = await fetch(`${API_URL}/registro`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        //de JavaScript a texto JSON
        body: JSON.stringify(datos)
    });

    const data = await respuesta.json();

    //si el status code es 400 o 500, lanza el error para que lo ataje el componente
    if (!respuesta.ok) {
        throw new Error(data.error || 'Error al registrarse');
    }

    return data;
};

interface DatosLogin {
    email: string;
    password: string;
}

export const iniciarSesion = async (datos: DatosLogin) => {
    const respuesta = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
    }

    return data;
};