// src/components/RoleSwitcher.tsx
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Shield, ChevronDown } from 'lucide-react';

type UserRole = 'administrador' | 'docente' | 'estudiante';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const roles: { value: UserRole; label: string; color: string }[] = [
    { value: 'administrador', label: 'Administrador', color: 'bg-purple-500' },
    { value: 'docente', label: 'Docente', color: 'bg-blue-500' },
    { value: 'estudiante', label: 'Estudiante', color: 'bg-green-500' },
  ];

  const currentRoleData = roles.find(r => r.value === currentRole);

  return (
    <div className="fixed top-20 right-4 z-50">
      <Card className="shadow-lg border-2 border-orange-400 bg-white">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-semibold text-orange-600">
              MOCK MODE
            </span>
          </div>
          
          <Button
            variant="outline"
            className="w-full justify-between gap-2 text-left"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${currentRoleData?.color}`} />
              <span className="text-sm">{currentRoleData?.label}</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>

          {isOpen && (
            <div className="mt-2 space-y-1">
              {roles.map((role) => (
                <Button
                  key={role.value}
                  variant={currentRole === role.value ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2 text-sm"
                  onClick={() => {
                    onRoleChange(role.value);
                    setIsOpen(false);
                  }}
                >
                  <div className={`w-3 h-3 rounded-full ${role.color}`} />
                  {role.label}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}