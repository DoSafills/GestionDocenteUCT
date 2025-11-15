import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, ChevronLeft, ChevronRight } from 'lucide-react';

type UserRole = 'administrador' | 'docente' | 'estudiante';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Mostrar si el mouse está en los primeros 100px desde arriba
      if (e.clientY < 100) {
        setIsVisible(true);
      } else if (e.clientY > 200) {
        // Ocultar si el mouse está más abajo de 200px
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const roles: { value: UserRole; label: string; color: string }[] = [
    { value: 'administrador', label: 'Administrador', color: 'bg-purple-500' },
    { value: 'docente', label: 'Docente', color: 'bg-blue-500' },
    { value: 'estudiante', label: 'Estudiante', color: 'bg-green-500' },
  ];

  const currentIndex = roles.findIndex(r => r.value === currentRole);
  const currentRoleData = roles[currentIndex];

  const handlePrevious = () => {
    const newIndex = (currentIndex - 1 + roles.length) % roles.length;
    onRoleChange(roles[newIndex].value);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % roles.length;
    onRoleChange(roles[newIndex].value);
  };

  return (
    <div 
      className={`fixed top-20 right-4 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-32 opacity-0'
      }`}
    >
      <Card className="shadow-lg border-2 border-orange-400 bg-white">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-semibold text-orange-600">
              MOCK MODE
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 shrink-0"
              onClick={handlePrevious}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex-1 flex items-center justify-center gap-2 px-2 py-2 bg-gray-50 rounded-md min-w-[140px]">
              <div className={`w-3 h-3 rounded-full ${currentRoleData?.color} shrink-0`} />
              <span className="text-sm font-medium">{currentRoleData?.label}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 shrink-0"
              onClick={handleNext}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Indicadores de posición */}
          <div className="flex justify-center gap-1.5 mt-3">
            {roles.map((role, index) => (
              <button
                key={role.value}
                onClick={() => onRoleChange(role.value)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex 
                    ? `w-6 ${role.color}` 
                    : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Cambiar a ${role.label}`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}