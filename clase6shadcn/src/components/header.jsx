"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function Header() {
  const [hasNotifications, setHasNotifications] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);

  const handleNotificationClick = () => {
    // Aquí puedes agregar la lógica para mostrar notificaciones
    console.log("Mostrar notificaciones");
    setHasNotifications(false); // Marcar como leídas
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-16 lg:px-6">
      <SidebarTrigger className="bg-amber-400" />
      
      <div className="flex-1">
        <h1 className="text-lg font-semibold md:text-xl">Dashboard</h1>
      </div>

      {/* Búsqueda */}
      <div className="hidden md:flex md:w-auto md:flex-1 md:max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-full pl-8"
          />
        </div>
      </div>

      {/* Notificaciones */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        onClick={handleNotificationClick}
      >
        <Bell className="h-5 w-5" />
        {hasNotifications && (
          <>
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-600" />
            {notificationCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </>
        )}
      </Button>

      {/* Usuario */}
      <div className="flex items-center gap-2">
        <div className="hidden md:block text-right">
          <p className="text-sm font-medium">Juan Pérez</p>
          <p className="text-xs text-muted-foreground">juan@example.com</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <span className="text-sm font-semibold">JP</span>
        </div>
      </div>
    </header>
  );
}
