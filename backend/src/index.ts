import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes'; // Importamos las rutas
import recetasRoutes from './routes/recetas.routes';

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));
app.use(express.json());

// Conecto las rutas de autenticación
app.use('/api/auth', authRoutes);
app.use('/api/recetas', recetasRoutes);


app.get('/', (req, res) => {
    res.send('El servidor del recetario esta levantado');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});