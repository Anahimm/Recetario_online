import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('ERROR FATAL: JWT_SECRET no está definido en el archivo .env');
}

//REGISTRO
export const registro = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, apellido, email, password } = req.body;

        const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
        if (usuarioExistente) {
            res.status(400).json({ error: 'El email ya está registrado' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const nuevoUsuario = await prisma.usuario.create({
            data: {
                nombre,
                apellido,
                email,
                password: hashedPassword,
            },
        });

        //token de sesión automático para este nuevo usuario
        const token = jwt.sign({ userId: nuevoUsuario.id }, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ 
            mensaje: 'Usuario creado y logueado con éxito', 
            token,
            usuario: { id: nuevoUsuario.id, email: nuevoUsuario.email } 
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

//LOGIN
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) {
            res.status(400).json({ error: 'Credenciales inválidas' });
            return;
        }

        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            res.status(400).json({ error: 'Credenciales inválidas' });
            return;
        }

        const token = jwt.sign({ userId: usuario.id }, JWT_SECRET, { expiresIn: '1d' });

        res.json({ 
            mensaje: 'Login exitoso', 
            token,
            usuario: {
                nombre: usuario.nombre,
                email: usuario.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};