import React, { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { authFetch } from "@/lib/authFetch";
import API_URL from "@/lib/config";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import { UsersRound, NotepadText, BookUser, ChartSpline } from "lucide-react";
import { sileo } from "sileo";

interface KPI {
  total_estudiantes: number;
  total_autoevaluaciones: number;
  total_retroalimentaciones: number;
  promedio_autoevaluaciones_por_estudiante: number;
}

interface CohorteGrafica {
  id: number;
  anio: number;
  periodo: number;
  total: number;
}

interface CohorteFiltro {
  id: number;
  anio: number;
  periodo: number;
}

interface ProfesorGrafica {
  id: number;
  nombre_1: string;
  nombre_2: string;
  apellido_1: string;
  apellido_2: string;
  total: number;
}

interface ProfesorFiltro {
  id: number;
  nombre_1: string;
  nombre_2: string;
  apellido_1: string;
  apellido_2: string;
}

interface ProcedimientoGrafica {
  id_procedimientos: number;
  nombre_p: string;
  total: number;
}

interface ProcedimientoFiltro {
  id_procedimientos: number;
  nombre_p: string;
}

interface LugarGrafica {
  id: number;
  nombre_lugar: string;
  total: number;
}

interface LugarFiltro {
  id: number;
  nombre_lugar: string;
}

interface EstudianteFiltro {
  id: number;
  nombre_1: string;
  nombre_2: string;
  apellido_1: string;
  apellido_2: string;
}

interface ProcedimientoMatriz {
  id: number;
  nombre: string;
}

interface MatrizEstudiante {
  estudiante: string;
  total: number;
  [key: string]: string | number;
}

interface DashboardData {
  kpis: KPI;
  graficas: {
    cohortes: CohorteGrafica[];
    profesores: ProfesorGrafica[];
    procedimientos: ProcedimientoGrafica[];
    lugares: LugarGrafica[];
  };
  filtros: {
    cohortes: CohorteFiltro[];
    profesores: ProfesorFiltro[];
    procedimientos: ProcedimientoFiltro[];
    lugares: LugarFiltro[];
    estudiantes: EstudianteFiltro[];
  };

  matriz_estudiantes: MatrizEstudiante[];
  procedimientos_matriz: ProcedimientoMatriz[];
}

export default function DashboardCoordinadorCurso() {
  const [data, setData] = useState<DashboardData | null>(null);

  const [filters, setFilters] = useState({
    cohorte: "",
    profesor: "",
    procedimiento: "",
    lugar: "",
    estudiante: "",
  });

  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      cargarDatos();
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const cargarDatos = async () => {
    try {
      const params = new URLSearchParams();

      if (filters.cohorte) params.append("cohorte", filters.cohorte);
      if (filters.profesor) params.append("profesor", filters.profesor);
      if (filters.procedimiento)
        params.append("procedimiento", filters.procedimiento);
      if (filters.lugar) params.append("lugar", filters.lugar);
      if (filters.estudiante) {
        params.append("estudiante", filters.estudiante);
      }

      const res = await authFetch(
        `${API_URL}/api/dashboard/coordinadorcurso/?${params.toString()}`,
      );

      if (!res.ok) throw new Error("Error en API");

      const json: DashboardData = await res.json();

      setData({
        kpis: json.kpis ?? {
          total_estudiantes: 0,
          total_autoevaluaciones: 0,
          total_retroalimentaciones: 0,
          promedio_autoevaluaciones_por_estudiante: 0,
        },
        graficas: {
          cohortes: json.graficas?.cohortes ?? [],
          profesores: json.graficas?.profesores ?? [],
          procedimientos: json.graficas?.procedimientos ?? [],
          lugares: json.graficas?.lugares ?? [],
        },
        filtros: {
          cohortes: json.filtros?.cohortes ?? [],
          profesores: json.filtros?.profesores ?? [],
          procedimientos: json.filtros?.procedimientos ?? [],
          lugares: json.filtros?.lugares ?? [],
          estudiantes: json.filtros?.estudiantes ?? [],
        },
        matriz_estudiantes: json.matriz_estudiantes ?? [],
        procedimientos_matriz: json.procedimientos_matriz ?? [],
      });
    } catch {
      sileo.error({
        title: "Error",
        description: "Problema de conexión con el servidor",
        duration: 3000,
        position: "top-center",
      });
    }
  };

  const kpis = useMemo(() => {
    if (!data?.kpis) return [];

    return [
      {
        label: "Estudiantes",
        value: data.kpis.total_estudiantes ?? 0,
        icon: UsersRound,
      },
      {
        label: "Autoevaluaciones",
        value: data.kpis.total_autoevaluaciones ?? 0,
        icon: NotepadText,
      },
      {
        label: "Retroalimentaciones",
        value: data.kpis.total_retroalimentaciones ?? 0,
        icon: BookUser,
      },
      {
        label: "Promedio",
        value: data.kpis.promedio_autoevaluaciones_por_estudiante ?? 0,
        icon: ChartSpline,
      },
    ];
  }, [data]);

  const cohortesData = useMemo(() => {
    if (!data?.graficas?.cohortes) return [];

    return data.graficas.cohortes.map((c) => ({
      name: `${c.anio}-${c.periodo}`,
      Total: c.total ?? 0,
    }));
  }, [data]);

  const profesoresData = useMemo(() => {
    if (!data?.graficas?.profesores) return [];

    return data.graficas.profesores.map((p) => ({
      name: `${p.nombre_1} ${p.nombre_2} ${p.apellido_1} ${p.apellido_2}`,
      Total: p.total ?? 0,
    }));
  }, [data]);

  const procedimientosData = useMemo(() => {
    if (!data?.graficas?.procedimientos) return [];

    return data.graficas.procedimientos.map((p) => ({
      name: p.nombre_p,
      Total: p.total ?? 0,
    }));
  }, [data]);

  const lugaresData = useMemo(() => {
    if (!data?.graficas?.lugares) return [];

    return data.graficas.lugares.map((l) => ({
      name: l.nombre_lugar,
      Total: l.total ?? 0,
    }));
  }, [data]);

  if (!data) {
    return <DashboardLayout children={undefined}></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Análisis general</p>
        </div>

        {/* FILTROS */}
        <Card>
          <CardContent className="p-4 grid gap-4 md:grid-cols-5">
            {/* COHORTE */}
            <div>
              <label className="text-xs text-muted-foreground">Cohorte</label>
              <Select
                value={filters.cohorte}
                onValueChange={(v) => setFilters({ ...filters, cohorte: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  {data.filtros.cohortes.map((c: CohorteFiltro) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.anio}-{c.periodo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* PROFESOR */}
            <div>
              <label className="text-xs text-muted-foreground">Profesor</label>
              <Select
                value={filters.profesor}
                onValueChange={(v) => setFilters({ ...filters, profesor: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  {data.filtros.profesores.map((p: ProfesorFiltro) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {`${p.nombre_1 ?? ""} ${p.nombre_2 ?? ""} ${p.apellido_1 ?? ""} ${p.apellido_2 ?? ""}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* PROCEDIMIENTO */}
            <div>
              <label className="text-xs text-muted-foreground">
                Procedimiento
              </label>
              <Select
                value={filters.procedimiento}
                onValueChange={(v) =>
                  setFilters({ ...filters, procedimiento: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  {data.filtros.procedimientos.map((p: ProcedimientoFiltro) => (
                    <SelectItem
                      key={p.id_procedimientos}
                      value={String(p.id_procedimientos)}
                    >
                      {p.nombre_p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* LUGAR */}
            <div>
              <label className="text-xs text-muted-foreground">Lugar</label>
              <Select
                value={filters.lugar}
                onValueChange={(v) => setFilters({ ...filters, lugar: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  {data.filtros.lugares.map((l: LugarFiltro) => (
                    <SelectItem key={l.id} value={String(l.id)}>
                      {l.nombre_lugar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                Estudiante
              </label>

              <Select
                value={filters.estudiante}
                onValueChange={(v) =>
                  setFilters({
                    ...filters,
                    estudiante: v,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>

                <SelectContent>
                  {data.filtros.estudiantes.map((e) => (
                    <SelectItem key={e.id} value={String(e.id)}>
                      {[e.nombre_1, e.nombre_2, e.apellido_1, e.apellido_2]
                        .filter(Boolean)
                        .join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* BOTON */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() =>
                  setFilters({
                    cohorte: "",
                    profesor: "",
                    procedimiento: "",
                    lugar: "",
                    estudiante: "",
                  })
                }
              >
                Limpiar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-4">
          {kpis.map((k, i) => {
            const Icon = k.icon;

            return (
              <Card key={i}>
                <CardContent className="p-5 flex justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{k.label}</p>
                    <h2 className="text-3xl font-bold">{k.value}</h2>
                  </div>

                  <div className="bg-primary/10 p-3 rounded-xl">
                    <Icon className="text-primary" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* GRAFICAS */}
        <div className="grid gap-6 ">
          {/* COHORTES */}
          <div className="bg-white shadow-sm border rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-4">
              Autoevaluaciones por Cohorte
            </h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cohortesData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.5} />

                  <XAxis dataKey="name" />
                  <YAxis />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "none",
                      borderRadius: "10px",
                      color: "#fff",
                    }}
                  />

                  <Legend />

                  <Bar
                    dataKey="Total"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={true}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PROFESORES */}
          <div className="bg-white shadow-sm border rounded-2xl p-5">
            <h3 className="font-semibold mb-3">
              Autoevaluaciones por Profesor
            </h3>

            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={profesoresData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.5} />

                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "none",
                      borderRadius: "10px",
                      color: "#fff",
                    }}
                  />

                  <Legend verticalAlign="bottom" />

                  <Bar
                    dataKey="Total"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={true}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PROCEDIMIENTOS */}
          <div className="bg-white shadow-sm border rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-4">
              Autoevaluaciones por Procedimiento
            </h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={procedimientosData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.5} />

                  <XAxis dataKey="name" />
                  <YAxis />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "none",
                      borderRadius: "10px",
                      color: "#fff",
                    }}
                  />

                  <Legend />

                  <Bar
                    dataKey="Total"
                    fill="#f59e0b"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={true}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* LUGARES */}
          <div className="bg-white shadow-sm border rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-4">
              Autoevaluaciones por Lugar
            </h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lugaresData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.5} />

                  <XAxis dataKey="name" />
                  <YAxis />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "none",
                      borderRadius: "10px",
                      color: "#fff",
                    }}
                  />

                  <Legend />

                  <Bar
                    dataKey="Total"
                    fill="#ef4444"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={true}
                  />
                </BarChart>


              </ResponsiveContainer>
            </div>
          </div>
                          {/* MATRIZ ESTUDIANTE VS PROCEDIMIENTO */}
<div className="bg-white shadow-sm border rounded-2xl p-5 overflow-hidden">
  <div className="mb-4">
    <h3 className="font-semibold text-lg">
      Autoevaluaciones por Estudiante
    </h3>

    <p className="text-sm text-muted-foreground">
      Matriz de procedimientos realizados por estudiante
    </p>
  </div>

  <div className="overflow-x-auto rounded-xl border">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-slate-100 border-b">
          <th className="text-left p-3 sticky left-0 bg-slate-100 min-w-[250px]">
            Estudiante
          </th>

          {data.procedimientos_matriz.map((p) => (
            <th
              key={p.id}
              className="p-3 text-center whitespace-nowrap min-w-[120px]"
            >
              {p.nombre}
            </th>
          ))}

          <th className="p-3 text-center bg-blue-50 font-semibold min-w-[100px]">
            Total
          </th>
        </tr>
      </thead>

      <tbody>
        {data.matriz_estudiantes.length === 0 ? (
          <tr>
            <td
              colSpan={
                data.procedimientos_matriz.length + 2
              }
              className="text-center py-8 text-muted-foreground"
            >
              No hay datos disponibles
            </td>
          </tr>
        ) : (
          data.matriz_estudiantes.map((row, idx) => (
            <tr
              key={idx}
              className="border-b hover:bg-slate-50 transition"
            >
              <td className="p-3 font-medium sticky left-0 bg-white border-r">
                {row.estudiante}
              </td>

              {data.procedimientos_matriz.map((p) => (
                <td
                  key={p.id}
                  className="p-3 text-center"
                >
                  {Number(row[p.nombre] ?? 0)}
                </td>
              ))}

              <td className="p-3 text-center font-bold bg-blue-50">
                {row.total}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
