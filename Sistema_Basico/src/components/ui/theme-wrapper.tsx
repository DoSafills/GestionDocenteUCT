import { cn } from "./utils";

interface ThemeWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function ThemeWrapper({ children, className }: ThemeWrapperProps) {
  return (
    <div className={cn("dark bg-background text-foreground min-h-screen", className)}>
      {children}
    </div>
  );
}