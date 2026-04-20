import { useState, useEffect, useCallback } from "react";
import { authFetch } from "@/lib/authFetch";
import API_URL from "@/lib/config";
import { sileo } from "sileo";

export interface Notificacion {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: "info" | "success" | "warning" | "error";
  leida: boolean;
  fecha: string;
}

export function useNotificaciones() {
  const rol = localStorage.getItem("rol")?.toLowerCase();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const res = await authFetch(`${API_URL}/api/notificaciones/${rol}/`);
      if (!res.ok) return;
      const data = await res.json();
      setNotificaciones(data.notificaciones);
      setNoLeidas(data.no_leidas);
    } catch {
      sileo.error({
        title: "Error",
        description: "Ha ocurrido un problema conexion con el servidor",
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setCargando(false);
    }
  }, [rol]);

  const marcarLeida = useCallback(async (id: number) => {
    try {
      await authFetch(`${API_URL}/api/notificaciones/${rol}/${id}/`, {
        method: "PATCH",
      });
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n)),
      );
      setNoLeidas((prev) => Math.max(0, prev - 1));
    } catch {
      sileo.error({
        title: "Error",
        description: "Error al marcar la notifiacion",
        duration: 3000,
        position: "top-left",
      });
    }
  }, [rol]);

  const marcarTodasLeidas = useCallback(async () => {
    try {
      await authFetch(`${API_URL}/api/notificaciones/${rol}/`, { method: "PATCH" });
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
      setNoLeidas(0);
    } catch {
      sileo.error({
        title: "Error",
        description: "Error al marcar las notificaciones",
        duration: 3000,
        position: "top-left",
      });
    }
  }, [rol]);

  const eliminar = useCallback(async (id: number) => {
    try {
      await authFetch(`${API_URL}/api/notificaciones/${rol}/${id}/`, {
        method: "DELETE",
      });
      setNotificaciones((prev) => {
        const notif = prev.find((n) => n.id === id);
        if (notif && !notif.leida) setNoLeidas((c) => Math.max(0, c - 1));
        return prev.filter((n) => n.id !== id);
      });
    } catch {
      sileo.error({
        title: "Error",
        description: "Error al eliminar la notificación",
        duration: 3000,
        position: "top-left",
      });
    }
  }, [rol]);

  const eliminarTodas = useCallback(async () => {
    try {
      await authFetch(`${API_URL}/api/notificaciones/${rol}/`, { method: "DELETE" });
      setNotificaciones([]);
      setNoLeidas(0);
    } catch {
      sileo.error({
        title: "Error",
        description: "Error al eliminar las notificaciones",
        duration: 3000,
        position: "top-left",
      });
    }
  }, [rol]);

  // Polling cada 30 segundos
  useEffect(() => {
    cargar();
    const intervalo = setInterval(cargar, 15_000);
    const onFocus = () => {
      cargar();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") cargar();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(intervalo);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [cargar]);

  return {
    notificaciones,
    noLeidas,
    cargando,
    cargar,
    marcarLeida,
    marcarTodasLeidas,
    eliminar,
    eliminarTodas,
  };
}
