import { DashboardLayout } from "@/components/DashboardLayout";
import { sileo } from "sileo";
import { useState } from "react";
import { authFetch } from "@/lib/authFetch";
import API_URL from "@/lib/config";
import { Button } from "@/components/ui/button";
import { FileCard } from "@/pages/roles/coordinador_curso/FileCard";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ErroresCarga {
  [fila: string]: {
    [campo: string]: string[];
  };
}

interface Estudiante {
  cedula_estudiante: number;
  nombre: string;
  semestre: number;
  estado: boolean;
}

export default function Students_coordinadorCurso() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [errores, setErrores] = useState<ErroresCarga | null>(null);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);

  // APIS
  const fetched = React.useRef(false);
  React.useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const cargarDatos = async () => {
      try {
        const [estudianteRes] = await Promise.all([
          fetch(`${API_URL}/api/estudiante/`),
        ]);

        const estudianteData = await estudianteRes.json();

        setEstudiantes(estudianteData);
      } catch {
        sileo.error({
          title: "Error",
          description: "Ha ocurrido un problema conexion con el servidor",
          duration: 3000,
          position: "top-center",
        });
      }
    };
    cargarDatos();
  });

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const archivo = e.dataTransfer.files?.[0];
    if (!archivo) return;

    if (!isExcel(archivo)) {
      sileo.warning({
        title: "Advertencia",
        description: "Solo se permiten archivos Excel (.xlsx)",
      });
      return;
    }

    setFile(archivo);
  };
  const handleUpload = async () => {
    if (!file) {
      sileo.info({
        title: "Información",
        description: "Selecciona un archivo",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file_excel", file);

    try {
      const response = await authFetch(
        `${API_URL}/api/cargarestudiantes/coordinadorcurso/`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (response.status === 400) {
        setErrores(data.detalles);
        sileo.error({
          title: "Errores en el archivo",
          description: "Revisa los errores",
        });
      } else if (response.ok) {
        setErrores(null);
        sileo.success({
          title: "Exitoso",
          description: (
            <>
              {data.message}
              <br />
              Estudiantes cargados: {data.cargados}
              <br />
              Estudiantes actualizados: {data.actualizados}
            </>
          ),
          position: "top-center",
        });
      }
    } catch {
      sileo.error({
        title: "Error",
        description: "Ha ocurrido un problema conexion con el servidor",
      });
    }
  };

  const descargarPlantillaExcel = async () => {
    const response = await fetch("/assets/files/Plantilla_Estudiantes.xlsx");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Plantilla_Estudiantes.xlsx";
    a.click();
  };

  const isExcel = (file: File) => {
    return (
      file.name.endsWith(".xlsx") ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold">Estudiantes</h1>
            <p className="text-muted-foreground">Carga masiva mediante Excel</p>
          </div>
          <Button variant="link" onClick={descargarPlantillaExcel}>
            Descargar plantilla
          </Button>
          {/* Grid */}
          <div
            className={`grid gap-6 ${
              errores ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {/* Izquierda*/}
            <div className="space-y-4">
              {/* Drag & Drop */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-10 transition
              flex flex-col items-center justify-center text-center gap-3
              ${dragging ? "border-primary bg-muted" : "border-gray-300"}
            `}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-md ring-1 ring-gray-300">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 16.2422C2.79401 15.435 2 14.0602 2 12.5C2 10.1564 3.79151 8.23129 6.07974 8.01937C6.54781 5.17213 9.02024 3 12 3C14.9798 3 17.4522 5.17213 17.9203 8.01937C20.2085 8.23129 22 10.1564 22 12.5C22 14.0602 21.206 15.435 20 16.2422M8 16L12 12M12 12L16 16M12 12V21"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>

                <p className="text-sm font-medium">
                  Arrastra tu archivo Excel aquí
                </p>

                <p className="text-sm text-muted-foreground">
                  o{" "}
                  <label
                    htmlFor="fileInput"
                    className="text-primary cursor-pointer hover:underline"
                  >
                    haz clic para subir
                  </label>
                </p>

                <input
                  type="file"
                  accept=".xlsx"
                  onChange={(e) => {
                    const archivo = e.target.files?.[0];
                    if (!archivo) return;

                    if (!isExcel(archivo)) {
                      return;
                    }

                    setFile(archivo);
                    e.target.value = "";
                  }}
                  className="hidden"
                  id="fileInput"
                />
              </div>

              {/* File Card */}
              {file && (
                <FileCard
                  key={file.name + file.lastModified}
                  name={file.name}
                  size={file.size}
                  onDelete={() => setFile(null)}
                />
              )}

              <Button onClick={handleUpload} disabled={!file}>
                Subir Excel
              </Button>
            </div>

            {/* Derecha (errores) */}
            {errores && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 h-fit">
                <h2 className="font-semibold text-red-600 mb-2">
                  Errores encontrados
                </h2>

                <div className="max-h-96 overflow-auto text-sm space-y-3">
                  {Object.entries(errores).map(([fila, campos]) => (
                    <div key={fila} className="border-b pb-2">
                      <p className="font-medium text-red-700">
                        Fila {Number(fila) + 1}
                      </p>

                      {Object.entries(campos).map(([campo, msgs]) => (
                        <div key={campo} className="ml-3">
                          <span className="font-medium">{campo}:</span>
                          <ul className="list-disc ml-5">
                            {msgs.map((m: string, i: number) => (
                              <li key={i}>{m}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="relative w-full overflow-hidden rounded-xl border border-gray-300">
            <Table className="min-w-[700px] ">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Cédula</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Semestre</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {estudiantes.length > 0 ? (
                  estudiantes.map((estudiante) => (
                    <TableRow
                      key={estudiante.cedula_estudiante}
                      className={`transition hover:bg-muted/40`}
                    >
                      <TableCell className="font-medium">
                        {estudiante.cedula_estudiante}
                      </TableCell>

                      <TableCell>{estudiante.nombre}</TableCell>

                      <TableCell>
                        <span className="px-2 py-1 bg-muted rounded text-xs">
                          {estudiante.semestre}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No hay resultados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
