// src/components/Layout.tsx
import type { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {

  return (
    // Aseguramos que el texto de todo el layout sea negro
    <div className="min-h-screen bg-background text-black flex flex-col pt-24">
      {/* Header flotante con bordes redondeados */}
      <Header />

      {/* Sidebar fijo */}
      <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
      
      <div className="flex flex-1">
        {/* Main Content con margen para el sidebar fijo */}
        <main className="flex-1 ml-64 p-6 text-black">
          {children}
        </main>
      </div>
    </div>
  );
}
