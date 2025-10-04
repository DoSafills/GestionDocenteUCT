import { useState } from 'react';
import { Layout } from './components/Layout';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { ProfesoresPage } from './pages/ProfesoresPage/ProfesoresPage';
import { SalasPage } from './components/salas/SalasPage';
import { AsignaturasPage } from '@pages/AsignaturasPage';
import { HorariosPage } from './components/horarios/HorariosPage';
import { RestriccionesPage } from './components/restricciones/RestriccionesPage';
import { CursosPage } from './components/cursos/CursosPage';
import LoginForm from './pages/LoginPage/index';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'sonner';

type Pagina = 'dashboard' | 'profesores' | 'salas' | 'asignaturas' | 'horarios' | 'restricciones' | 'cursos';

const paginaMap: Record<Pagina, JSX.Element> = {
    dashboard: <DashboardPage />,
    profesores: <ProfesoresPage />,
    salas: <SalasPage />,
    asignaturas: <AsignaturasPage />,
    horarios: <HorariosPage />,
    restricciones: <RestriccionesPage />,
    cursos: <CursosPage />,
};

export default function App() {
    return (
        <AuthProvider>
            <MainApp />
            <Toaster richColors position='top-right' expand />
        </AuthProvider>
    );
}

function MainApp() {
    const [paginaActual, setPaginaActual] = useState<Pagina>('asignaturas');
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className='min-h-screen flex items-center justify-center p-4'>
                <div className='w-full max-w-sm'>
                    <LoginForm />
                </div>
            </div>
        );
    }

    return (
        <Layout currentPage={paginaActual} onPageChange={(p) => setPaginaActual(p as Pagina)}>
            {paginaMap[paginaActual]}
        </Layout>
    );
}
