// src/components/Layout.tsx
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
    Users,
    Building,
    BookOpen,
    Settings,
    Home,
    Calendar,
    LogOut,
} from 'lucide-react';
import Header from './Header';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import { RoleSwitcher } from './RoleSwitcher'; // Importar el componente mock

const SIDEBAR_BREAKPOINT = 1024;

interface LayoutProps {
    children: ReactNode;
    currentPage: string;
    onPageChange: (page: string) => void;
}

// Definición de tipos de roles
type UserRole = 'administrador' | 'docente' | 'estudiante';

interface MenuItem {
    id: string;
    label: string;
    icon: any;
    allowedRoles: UserRole[]; // Roles que pueden ver este item
}

// Items del menú con sus roles permitidos
const menuItems: MenuItem[] = [
    { 
        id: 'dashboard', 
        label: 'Dashboard', 
        icon: Home,
        allowedRoles: ['administrador']
    },
    { 
        id: 'profesores', 
        label: 'Profesores', 
        icon: Users,
        allowedRoles: ['administrador', 'docente', 'estudiante']
    },
    { 
        id: 'edificios', 
        label: 'Salas y Edificios', 
        icon: Building,
        allowedRoles: ['administrador', 'docente']
    },
    { 
        id: 'asignaturas', 
        label: 'Asignaturas', 
        icon: BookOpen,
        allowedRoles: ['administrador', 'docente', 'estudiante']
    },
    { 
        id: 'horarios', 
        label: 'Horarios', 
        icon: Calendar,
        allowedRoles: ['administrador', 'docente', 'estudiante']
    },
    { 
        id: 'restricciones', 
        label: 'Restricciones', 
        icon: Settings,
        allowedRoles: ['administrador'] // Solo administradores
    },
];

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
    const width = useWindowWidth();
    const isSidebarVisible = width >= SIDEBAR_BREAKPOINT;

    // Estado para el rol mockeado - iniciamos con 'administrador' por defecto
    const [mockRole, setMockRole] = useState<UserRole>('administrador');

    // Usar directamente el rol mockeado
    const userRole = mockRole;

    // Filtrar items del menú según el rol del usuario
    const filteredMenuItems = menuItems.filter(item => 
        item.allowedRoles.includes(userRole)
    );

    // Handler mock para logout (solo para desarrollo)
    const handleLogout = () => {
        console.log('Logout simulado (mock mode)');
        // Aquí podrías agregar lógica adicional si lo necesitas
    };

    return (
        <div className='min-h-screen bg-background flex flex-col text-black'>
            <Header />
            
            {/* Role Switcher Mock - Para testing de roles */}
            <RoleSwitcher 
                currentRole={userRole} 
                onRoleChange={setMockRole}
            />
            
            <div className='flex flex-1'>
                {isSidebarVisible && (
                    <aside className='w-64 bg-card border-r min-h-[calc(100vh-80px)] text-black flex flex-col'>
                        <Card className='m-4 border-0 shadow-none flex-1'>
                            <CardContent className='p-4 space-y-2 flex flex-col h-full'>
                                <div>
                                    <h3 className='text-sm mb-4'>NAVEGACIÓN</h3>
                                    {filteredMenuItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = currentPage === item.id;
                                        return (
                                            <Button
                                                key={item.id}
                                                variant={isActive ? 'default' : 'ghost'}
                                                className={`w-full justify-start gap-3 transition-colors duration-200 text-black ${
                                                    isActive 
                                                        ? 'bg-primary text-primary-foreground-alt' 
                                                        : 'hover:bg-primary/10'
                                                }`}
                                                onClick={() => onPageChange(item.id)}
                                                aria-current={isActive ? 'page' : undefined}
                                            >
                                                <Icon className='w-4 h-4' />
                                                {item.label}
                                            </Button>
                                        );
                                    })}
                                </div>
                                <div className='mt-auto pt-4 border-t'>
                                    <Button
                                        variant='ghost'
                                        className='w-full justify-start gap-3 text-red-600 hover:bg-red-50'
                                        onClick={handleLogout}
                                    >
                                        <LogOut className='w-4 h-4' />
                                        Cerrar sesión
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>
                )}
                <main className='flex-1 p-6 text-black'>{children}</main>
            </div>
        </div>
    );
}