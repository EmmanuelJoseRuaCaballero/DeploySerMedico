import { DashboardLayout } from "@/components/DashboardLayout";
import { useRef, useState, useEffect } from "react";
import { useFotoPerfil } from "@/hooks/use-fotoperfil";
import { Camera, Trash2, Upload, User } from "lucide-react";
import { authFetch } from "@/lib/authFetch";
import API_URL from "@/lib/config";
import { sileo } from "sileo";

export default function Settings_coordinadorCurso() {
  const [nombre, setNombre] = useState<string>("");
  const [cedula, setCedula] = useState<number | string>(0);

  const { fotoUrl, subiendo, subirFoto, eliminarFoto } = useFotoPerfil();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (archivo) subirFoto(archivo);
    e.target.value = "";
  };

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const response = await authFetch(`${API_URL}/api/perfil/`, {});
        const data = await response.json();
        setNombre(data.nombre);
        setCedula(data.cedula);
  
        if (!response.ok) {
          sileo.error({
            title: "Error obteniendo perfil",
            duration: 3000,
            position: "top-center",
          });
          return;
        }
      } catch {
        sileo.error({
            title: "Error en el perfil",
            duration: 3000,
            position: "top-center",
          });
          return;
      }
    };
    obtenerPerfil();
  }, []);
    
  return (
    <DashboardLayout>
      <div className="space-y-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ajustes</h1>
          <p className="text-muted-foreground mt-2">
            Administra tu perfil y preferencias
          </p>
        </div>

        {/* Foto de perfil */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Foto de perfil
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            JPG, PNG · Máximo 5 MB
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative group flex-shrink-0">
              <div className="h-28 w-28 rounded-full border-2 border-border bg-muted overflow-hidden flex items-center justify-center">
                {fotoUrl ? (
                  <img
                    src={fotoUrl}
                    alt="Foto de perfil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-muted-foreground/50" />
                )}
              </div>
              <button
                onClick={() => inputRef.current?.click()}
                disabled={subiendo}
                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
              >
                <Camera size={24} className="text-white" />
              </button>
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => inputRef.current?.click()}
                disabled={subiendo}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                <Upload size={16} />
                {subiendo ? "Subiendo…" : "Subir foto"}
              </button>
              {fotoUrl && (
                <button
                  onClick={eliminarFoto}
                  disabled={subiendo}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-60"
                >
                  <Trash2 size={16} />
                  Eliminar foto
                </button>
              )}
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleArchivo}
          />
        </div>

        {/* Info personal */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Información personal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Nombre completo
              </p>
              <p className="text-sm font-medium bg-muted px-3 py-2 rounded-lg">
                {nombre}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Cédula</p>
              <p className="text-sm font-medium bg-muted px-3 py-2 rounded-lg">
                {cedula}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Para cambiar tu información personal, comunícate con la
            coordinación.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
