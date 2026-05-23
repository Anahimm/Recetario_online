import { z } from 'zod';

export const registroSchema = z.object({
    nombre: z.string({ message: 'El nombre es obligatorio' }).min(2, 'El nombre debe tener al menos 2 letras'),
    apellido: z.string({ message: 'El apellido es obligatorio' }).min(2, 'El apellido debe tener al menos 2 letras'),
    email: z.string({ message: 'El email es obligatorio' }).email('El formato del correo no es válido'),
    password: z.string({ message: 'La contraseña es obligatoria' }).min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmarPassword: z.string({ message: 'Debes confirmar la contraseña' })
}).refine((data) => data.password === data.confirmarPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmarPassword']
});

export const loginSchema = z.object({
    email: z.string({ message: 'El email es obligatorio' }).email('El formato del correo no es válido'),
    password: z.string({ message: 'La contraseña es obligatoria' }).min(1, 'La contraseña no puede estar vacía')
});