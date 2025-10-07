// src/components/Layout.tsx
import type { ReactNode } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
    Users,
    Building,
    BookOpen,
    Settings,
    Home,
    GraduationCap,
    Calendar,
    LogOut, // <-- importamos ícono de lucide-react
} from 'lucide-react';
import Header from './Header';
import { useAuth } from '../context/AuthContext'; // <-- importamos logout

interface LayoutProps {
    children: ReactNode;
    currentPage: string;
    onPageChange: (page: string) => void;
}

const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profesores', label: 'Profesores', icon: Users },
    { id: 'edificios', label: 'Salas y Edificios', icon: Building },
    { id: 'asignaturas', label: 'Asignaturas', icon: BookOpen },
    { id: 'horarios', label: 'Horarios', icon: Calendar },
    { id: 'restricciones', label: 'Restricciones', icon: Settings },
    { id: 'cursos', label: 'Cursos Extensión', icon: GraduationCap },
];

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
    const { logout } = useAuth(); // usamos el logout de tu contexto

    return (
        <div className='min-h-screen bg-background flex flex-col text-black'>
            {/* Header */}
            <Header />

            <div className='flex flex-1'>
                {/* Sidebar */}
                <aside className='w-64 bg-card border-r min-h-[calc(100vh-80px)] text-black flex flex-col'>
                    <Card className='m-4 border-0 shadow-none flex-1'>
                        <CardContent className='p-4 space-y-2 flex flex-col h-full'>
                            <div>
                                <h3 className='text-sm mb-4'>NAVEGACIÓN</h3>
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = currentPage === item.id;

                                    return (
                                        <Button
                                            key={item.id}
                                            variant={isActive ? 'default' : 'ghost'}
                                            className={`w-full justify-start gap-3 transition-colors duration-200 text-black ${isActive ? 'bg-primary text-primary-foreground-alt' : 'hover:bg-primary/10'}`}
                                            onClick={() => onPageChange(item.id)}
                                            aria-current={isActive ? 'page' : undefined}
                                        >
                                            <Icon className='w-4 h-4' />
                                            {item.label}
                                        </Button>
                                    );
                                })}
                            </div>

                            {/* Botón Logout en la parte inferior */}
                            <div className='mt-auto pt-4 border-t'>
                                <Button
                                    variant='ghost'
                                    className='w-full justify-start gap-3 text-red-600 hover:bg-red-50'
                                    onClick={logout}
                                >
                                    <LogOut className='w-4 h-4' />
                                    Cerrar sesión
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </aside>

                {/* Main Content */}
                <main className='flex-1 p-6 text-black'>{children}</main>
            </div>
        </div>
    );
}
