import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodTypeAny } from 'zod';

export const validarSchema = (schema: ZodTypeAny) => 
    (req: Request, res: Response, next: NextFunction): void => {
        try {
            schema.parse(req.body);
            next(); 
        } catch (error) {
            if (error instanceof ZodError) {
                const mensajesDeError = error.issues.map((err) => err.message).join(', ');
                res.status(400).json({ error: mensajesDeError });
                return;
            }
            res.status(500).json({ error: 'Error interno de validación' });
        }
    };