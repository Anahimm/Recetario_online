import { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

// CREAR
export const crearReceta = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { titulo, descripcion, ingredientes, imagen_url } = req.body;
        const usuario_id = req.usuario_id;

        if (!usuario_id) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }

        // Creamos la receta base
        const nuevaReceta = await prisma.receta.create({
            data: { titulo, descripcion, imagen_url, usuario_id }
        });

        // Procesamos el array de ingredientes
        if (ingredientes && Array.isArray(ingredientes)) {
            for (const item of ingredientes) {
                // UPSERT: Busca el ingrediente. Si existe, lo trae. Si no existe, lo crea.
                // Lo pasamos a minúsculas para no tener duplicados.
                const ingredienteDb = await prisma.ingrediente.upsert({
                    where: { nombre: item.nombre.toLowerCase() },
                    update: {},
                    create: { nombre: item.nombre.toLowerCase() }
                });

                // Creamos la relación en la tabla intermedia con la cantidad
                await prisma.recetaIngrediente.create({
                    data: {
                        cantidad: item.cantidad,
                        receta_id: nuevaReceta.id,
                        ingrediente_id: ingredienteDb.id
                    }
                });
            }
        }
        res.status(201).json({ mensaje: 'Receta creada con éxito', id: nuevaReceta.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno al guardar la receta' });
    }
};

// MIS RECETAS
export const obtenerMisRecetas = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const usuario_id = req.usuario_id;
        const misRecetas = await prisma.receta.findMany({
            where: { usuario_id: usuario_id },
            include: {
                ingredientes: {
                    include: {
                        ingrediente: true 
                    }
                }
            }
        });
        res.json(misRecetas);
    } catch (error) {
        res.status(500).json({ error: 'Error interno al buscar las recetas' });
    }
};

// EDITAR
export const editarReceta = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, ingredientes, imagen_url } = req.body;
        const usuario_id = req.usuario_id;

        // Verificamos que la receta exista y sea de este usuario
        const recetaExistente = await prisma.receta.findFirst({
            where: { id: Number(id), usuario_id: usuario_id }
        });

        if (!recetaExistente) {
            res.status(404).json({ error: 'Receta no encontrada o no tenés permiso' });
            return;
        }
        // Actualizamos los datos básicos y borramos las relaciones viejas de ingredientes
        await prisma.receta.update({
            where: { id: recetaExistente.id },
            data: { 
                titulo, 
                descripcion, 
                imagen_url,
                ingredientes: { deleteMany: {} }
            }
        });

        // Volvemos a insertar los ingredientes actualizados
        if (ingredientes && Array.isArray(ingredientes)) {
            for (const item of ingredientes) {
                const ingredienteDb = await prisma.ingrediente.upsert({
                    where: { nombre: item.nombre.toLowerCase() },
                    update: {},
                    create: { nombre: item.nombre.toLowerCase() }
                });
                await prisma.recetaIngrediente.create({
                    data: {
                        cantidad: item.cantidad,
                        receta_id: recetaExistente.id,
                        ingrediente_id: ingredienteDb.id
                    }
                });
            }
        }
        res.json({ mensaje: 'Receta actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la receta' });
    }
};

// ELIMINAR
export const eliminarReceta = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const usuario_id = req.usuario_id;

        const recetaEliminada = await prisma.receta.deleteMany({
            where: { id: Number(id), usuario_id: usuario_id }
        });

        if (recetaEliminada.count === 0) {
            res.status(404).json({ error: 'Receta no encontrada o no tenés permiso' });
            return;
        }
        res.json({ mensaje: 'Receta eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la receta' });
    }
};

// MURO PÚBLICO
export const obtenerRecetasPublicas = async (req: Request, res: Response): Promise<void> => {
    try {
        const recetas = await prisma.receta.findMany({
            include: {
                usuario: { select: { nombre: true, apellido: true } },
                calificaciones: true,
                ingredientes: { include: { ingrediente: true } }
            },
            orderBy: { id: 'desc' }
        });
        res.json(recetas);
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar el muro de recetas' });
    }
};

// RECETA INDIVIDUAL
export const obtenerUnaRecetaPublica = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const receta = await prisma.receta.findUnique({
            where: { id: Number(id) },
            include: {
                usuario: { select: { nombre: true, apellido: true } },
                ingredientes: { include: { ingrediente: true } }
            }
        });

        if (!receta) {
            res.status(404).json({ error: 'La receta no existe o fue eliminada' });
            return;
        }
        res.json(receta);
    } catch (error) {
        res.status(500).json({ error: 'Error interno al cargar la receta pública' });
    }
};

// CALIFICAR
export const calificarReceta = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { puntaje } = req.body;
        const usuario_id = req.usuario_id;

        if (!usuario_id) {
            res.status(401).json({ error: 'Iniciá sesión para calificar' });
            return;
        }

        if (puntaje < 1 || puntaje > 5) {
            res.status(400).json({ error: 'El puntaje debe ser entre 1 y 5' });
            return;
        }

        const calificacion = await prisma.calificacion.upsert({
            where: {
                usuario_id_receta_id: { usuario_id: usuario_id, receta_id: Number(id) }
            },
            update: { puntaje: Number(puntaje) },
            create: { puntaje: Number(puntaje), usuario_id: usuario_id, receta_id: Number(id) }
        });

        res.json({ mensaje: 'Calificación guardada con éxito', calificacion });
    } catch (error) {
        res.status(500).json({ error: 'Error interno al procesar la calificación' });
    }
};