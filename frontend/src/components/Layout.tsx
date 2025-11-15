import type { ReactNode } from 'react';
import { useState, useEffect, createContext, useContext } from 'react';
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
import { RoleSwitcher } from './RoleSwitcher';
import { authService, type Rol } from '../application/services/AuthService';

const SIDEBAR_BREAKPOINT = 1024;

// Definición de tipos de roles
type UserRole = 'administrador' | 'docente' | 'estudiante';

// Función para mapear entre tipos
function rolToUserRole(rol: Rol): UserRole {
    return rol.toLowerCase() as UserRole;
}

// Contexto para compartir el rol en toda la aplicación
interface RoleContextType {
    currentRole: UserRole;
    isAuthenticated: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Hook personalizado para usar el contexto de rol
export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('useRole debe usarse dentro del Layout');
    }
    return context;
};

interface LayoutProps {
    children: ReactNode;
    currentPage: string;
    onPageChange: (page: string) => void;
}

interface MenuItem {
    id: string;
    label: string;
    icon: any;
    allowedRoles: UserRole[];
}

// Items del menú con sus roles permitidos
const menuItems: MenuItem[] = [
    { 
        id: 'dashboard', 
        label: 'Dashboard', 
        icon: Home,
        allowedRoles: ['administrador', 'docente', 'estudiante']
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
        allowedRoles: ['administrador']
    },
];

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
    const width = useWindowWidth();
    const isSidebarVisible = width >= SIDEBAR_BREAKPOINT;

    // Estado para el rol actual desde AuthService
    const [currentRole, setCurrentRole] = useState<UserRole>('estudiante');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Suscribirse a cambios en AuthService
    useEffect(() => {
        const unsubscribe = authService.onChange((user) => {
            if (user) {
                setCurrentRole(rolToUserRole(user.rol));
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        });

        // Cargar usuario inicial
        const user = authService.getUsuarioActual();
        if (user) {
            setCurrentRole(rolToUserRole(user.rol));
            setIsAuthenticated(true);
        } else {
            // Si no hay usuario, intentar cargar desde API
            authService.cargarUsuarioDesdeApi();
        }

        return unsubscribe;
    }, []);

    // Filtrar items del menú según el rol del usuario
    const filteredMenuItems = menuItems.filter(item => 
        item.allowedRoles.includes(currentRole)
    );

    // Handler para logout
    const handleLogout = () => {
        authService.clear();
        // Aquí podrías redirigir al login o hacer otras acciones
        console.log('Cerrando sesión...');
        // Por ejemplo: window.location.href = '/login';
    };

    return (
        <RoleContext.Provider value={{ currentRole, isAuthenticated }}>
            <div className='min-h-screen bg-background flex flex-col text-black'>
                <Header />
                
                {/* Role Switcher (solo visible en modo mock) */}
                <RoleSwitcher />
                
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
                                    
                                    {/* Información del usuario */}
                                    {isAuthenticated && (
                                        <div className='px-2 py-3 border-t'>
                                            <div className='text-xs text-muted-foreground mb-1'>
                                                Usuario actual
                                            </div>
                                            <div className='text-sm font-medium'>
                                                {authService.getUsuarioActual()?.nombre}
                                            </div>
                                            <div className='text-xs text-muted-foreground'>
                                                {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
                                            </div>
                                        </div>
                                    )}
                                    
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
        </RoleContext.Provider>
    );
}