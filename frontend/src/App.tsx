import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/navbar';
import { Login } from './pages/login';
import { Registro } from './pages/registro';
import { MisRecetas } from './pages/misRecetas';
import { RecetaPublica } from './pages/recetaPublica';
import { Explorar } from './pages/explorar';
import { RutaProtegida } from './components/rutaProtegida'; 

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route element={<RutaProtegida />}>
              <Route path="/mis-recetas" element={<MisRecetas />} />
            </Route>
            <Route path="/receta/:id" element={<RecetaPublica />} />
            <Route path="/explorar" element={<Explorar />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;