import { useState } from 'react';
import { Layout } from './components/Layout';
import { DashboardPage } from '@pages/DashboardPage';
import { ProfesoresPage } from '@pages/ProfesoresPage';
import { EdificiosPage } from '@pages/EdificiosPage';
import { AsignaturasPage } from '@pages/AsignaturasPage';
import { HorariosPage } from '@pages/HorariosPage';
import { RestriccionesPage } from '@pages/RestriccionesPage/ui/pages';
import { CursosPage } from './components/cursos/CursosPage';
import LoginForm from './pages/LoginPage/index';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'sonner';

type Pagina = 'dashboard' | 'profesores' | 'edificio' | 'asignaturas' | 'horarios' | 'restricciones' | 'cursos';

const paginaMap: Record<Pagina, JSX.Element> = {
    dashboard: <DashboardPage />,
    profesores: <ProfesoresPage />,
    edificios: <EdificiosPage />,
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
    const [paginaActual, setPaginaActual] = useState<Pagina>('dashboard');
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
