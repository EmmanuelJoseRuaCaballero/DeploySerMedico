import { DashboardLayout } from "@/components/DashboardLayout";

export default function Dashboard_coordinadorCurso() {

  return (
    <DashboardLayout>
      <div className="space-y-3">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Bienvenido
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tu portafolio médico y tu progreso académico
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
