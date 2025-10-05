import { useState } from 'react';
import { Layout } from '../src/components/Layout';
import { DashboardPage } from '../src/components/dashboard/DashboardPage';
import { ProfesoresPage } from '../src/pages/ProfesoresPage/ProfesoresPage';
import { SalasPage } from '../src/components/salas/SalasPage';
import { AsignaturasPage } from '@pages/AsignaturasPage';
import { HorariosPage } from '../src/components/horarios/HorariosPage';
import { RestriccionesPage } from '../src/pages/RestriccionesPage/RestriccionesPage';
import { CursosPage } from '../src/components/cursos/CursosPage';
import LoginForm from '../src/pages/LoginPage';
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
