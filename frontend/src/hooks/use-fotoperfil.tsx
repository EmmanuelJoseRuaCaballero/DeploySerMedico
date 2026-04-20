import { useState, useEffect, useCallback } from "react";
import { authFetch } from "@/lib/authFetch";
import { sileo } from "sileo";
import API_URL from "@/lib/config";

export function useFotoPerfil() {
  const [fotoUrl, setFotoUrl] = useState<string | null>(
    localStorage.getItem("foto_perfil"),
  );
  const [subiendo, setSubiendo] = useState(false);

  const cargarFoto = useCallback(async () => {
    try {
      const res = await authFetch(`${API_URL}/api/fotoperfil/`);
      if (!res.ok) return;
      const data = await res.json();
      const url = data.foto_perfil ?? null;
      setFotoUrl(url);
      if (url) localStorage.setItem("foto_perfil", url);
      else localStorage.removeItem("foto_perfil");
    } catch {
      sileo.error({
        title: "Error",
        description: "Ha ocurrido un problema al cargar la foto",
        duration: 3000,
        position: "top-center",
      });
    }
  }, []);

  useEffect(() => {
    cargarFoto();
  }, [cargarFoto]);

  const subirFoto = useCallback(async (archivo: File) => {
    setSubiendo(true);
    try {
      const form = new FormData();
      form.append("foto_perfil", archivo);

      const res = await authFetch(`${API_URL}/api/fotoperfil/`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        sileo.error({
          title: "Error",
          description: data.error,
          duration: 3000,
          position: "top-right",
        });
        return false;
      }

      const url = data.foto_perfil;
      setFotoUrl(url);
      localStorage.setItem("foto_perfil", url);
      sileo.success({
        title: "Exitoso",
        description: data.message,
        duration: 5000,
        position: "top-right",
      });
      await new Promise((resolve) => setTimeout(resolve, 3000));
      window.location.reload();
      return true;
    } catch {
      sileo.error({
        title: "Error",
        description: "Ha ocurrido un problema al cargar la foto",
        duration: 3000,
        position: "top-center",
      });
      return false;
    } finally {
      setSubiendo(false);
    }
  }, []);

  const eliminarFoto = useCallback(async () => {
    try {
      const res = await authFetch(`${API_URL}/api/fotoperfil/`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        sileo.error({
          title: "Error",
          description: "No se pudo eliminar la foto",
          duration: 3000,
          position: "top-right",
        });
        return;
      }
      setFotoUrl(null);
      localStorage.removeItem("foto_perfil");
      sileo.success({
        title: "Exitoso",
        description: data.message,
        duration: 5000,
        position: "top-right",
      });
      await new Promise((resolve) => setTimeout(resolve, 3000));
      window.location.reload();
    } catch {
      sileo.error({
        title: "Error",
        description: "Ha ocurrido un problema al cargar la foto",
        duration: 3000,
        position: "top-center",
      });
    }
  }, []);

  return { fotoUrl, subiendo, subirFoto, eliminarFoto, cargarFoto };
}
