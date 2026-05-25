import {
  LogOut,
  Menu,
  Bell,
  X,
  CheckCheck,
  Trash2,
  Info,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  User,
} from "lucide-react";
import { logout } from "@/lib/auth";
import { useFotoPerfil } from "@/hooks/use-fotoperfil";
import { useState, useRef } from "react";
import {
  useNotificaciones,
  type Notificacion,
} from "@/hooks/use-notifiaciones";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onMenuClick: () => void;
}

function IconoTipo({ tipo }: { tipo: Notificacion["tipo"] }) {
  switch (tipo) {
    case "success":
      return <CheckCircle size={14} className="text-green-500 flex-shrink-0" />;
    case "warning":
      return (
        <AlertTriangle size={14} className="text-yellow-500 flex-shrink-0" />
      );
    case "error":
      return <AlertCircle size={14} className="text-red-500 flex-shrink-0" />;
    default:
      return <Info size={14} className="text-blue-500 flex-shrink-0" />;
  }
}

function formatFecha(iso: string) {
  const d = new Date(iso);
  const ahora = new Date();
  const diff = Math.floor((ahora.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "Ahora";
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const nombre = localStorage.getItem("nombre");
  const { fotoUrl } = useFotoPerfil();

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const {
    notificaciones,
    noLeidas,
    cargando,
    marcarLeida,
    marcarTodasLeidas,
    eliminar,
    eliminarTodas,
  } = useNotificaciones();

  const [panelAbierto, setPanelAbierto] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const esNotificacionAutoevaluacion = (n: Notificacion) => {
    const titulo = n.titulo.toLowerCase();
    return (
      titulo.includes("nueva autoevaluación recibida") ||
      titulo.includes("nueva autoevaluacion recibida")
    );
  };

  const handleClickNotificacion = (n: Notificacion) => {
    console.log(n);
    if (!n.leida) marcarLeida(n.id);
    if (esNotificacionAutoevaluacion(n)) {
      setPanelAbierto(false);
      navigate("/profesor/evaluations");
    }
  };

  return (
    <nav className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white border-b border-border flex items-center px-4 md:px-6 shadow-sm transition-all z-40">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Hamburger (mobile only) */}
        <button className="md:hidden" onClick={onMenuClick}>
          <Menu size={22} />
        </button>
      </div>

      {/* Right Section */}
      <div className="ml-auto flex items-center gap-2 md:gap-6">
        {/* User Profile */}
        <div className="flex items-center gap-3 md:gap-4 ml-2 md:ml-4">
          {/* Profile Image */}
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
            {fotoUrl ? (
              <img
                src={fotoUrl}
                alt="Foto de perfil"
                onClick={() => setOpen(true)}
                className="h-full w-full object-cover rounded-full cursor-pointer"
              />
            ) : (
              <User size={20} className="text-muted-foreground/50" />
            )}
          </div>

          {/* Modal */}
          {open && fotoUrl && (
            <div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
              onClick={() => setOpen(false)}
            >
              <img
                src={fotoUrl}
                alt="Foto completa"
                className="max-h-[50%] max-w-[50%] rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
              />
            </div>
          )}

          {/* User Info */}
          <div className="flex flex-col">
            <p className="text-xs md:text-sm font-semibold text-foreground">
              {nombre}
            </p>
            <p className="h-6 text-xs text-muted-foreground">
              Code: 2045547646
            </p>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setPanelAbierto((v) => !v)}
            className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            title="Notificaciones"
          >
            <Bell size={20} className="text-foreground" />
            {noLeidas > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {noLeidas > 99 ? "99+" : noLeidas}
              </span>
            )}
          </button>

          {panelAbierto && (
            <div className="absolute right-0 top-12 w-80 md:w-96 bg-white border border-border rounded-xl shadow-xl z-50 overflow-hidden">
              {/* Header panel */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Bell size={16} />
                  <span className="font-semibold text-sm">Notificaciones</span>
                  {noLeidas > 0 && (
                    <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {noLeidas} nueva{noLeidas > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {noLeidas > 0 && (
                    <button
                      onClick={marcarTodasLeidas}
                      title="Marcar todas como leídas"
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <CheckCheck size={15} />
                    </button>
                  )}
                  {notificaciones.length > 0 && (
                    <button
                      onClick={eliminarTodas}
                      title="Eliminar todas"
                      className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => setPanelAbierto(false)}
                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              <div className="max-h-[380px] overflow-y-auto divide-y divide-border">
                {cargando && notificaciones.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground text-sm">
                    Cargando…
                  </div>
                ) : notificaciones.length === 0 ? (
                  <div className="py-10 text-center">
                    <Bell
                      size={32}
                      className="mx-auto text-muted-foreground/40 mb-2"
                    />
                    <p className="text-sm text-muted-foreground">
                      Sin notificaciones
                    </p>
                  </div>
                ) : (
                  notificaciones.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleClickNotificacion(n)}
                      className={`flex gap-3 px-4 py-3 transition-colors cursor-pointer group ${
                        !n.leida
                          ? "bg-blue-50/60 hover:bg-blue-50"
                          : "hover:bg-muted/40"
                      }`}
                    >
                      <div className="mt-0.5">
                        <IconoTipo tipo={n.tipo} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm truncate ${!n.leida ? "font-semibold" : ""}`}
                        >
                          {n.titulo}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {n.mensaje}
                        </p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">
                          {formatFecha(n.fecha)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          eliminar(n.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 hover:text-red-500 text-muted-foreground transition-all self-start"
                        title="Eliminar"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider (desktop only) */}
        <div className="hidden md:block h-6 w-px" style={{ backgroundColor: "#000000" }}></div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border border-primary/45 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors font-medium text-xs md:text-sm"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>
      </div>
    </nav>
  );
}
