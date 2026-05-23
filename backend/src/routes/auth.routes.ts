import { Router } from 'express';
import { registro, login } from '../controllers/auth.controller';
import { validarSchema } from '../middlewares/validarDatos.middleware';
import { registroSchema, loginSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/registro', validarSchema(registroSchema), registro);
router.post('/login', validarSchema(loginSchema), login);

export default router;