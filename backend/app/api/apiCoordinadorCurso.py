from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
from django.db.models import Q, Count, Avg
import pandas as pd

from ..models import (
    Autoevaluacion,
    CohorteIngreso,
    Cursos,
    Estudiante,
    Lugar,
    ProcedimientoAutoevaluacion,
    Procedimientos,
    Profesor,
    Retroalimentacion
)

# Convierte la primera letra en mayuscula
def capitalizar_texto(texto):
    if pd.isna(texto):
        return None
    return str(texto).strip().title()

class CargarEstudiantes(APIView):

    def post(self, request):
        try:
            user = request.user

            if not user.groups.filter(name="CoordinadorCurso").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )

            archivo = request.FILES.get('file_excel')

            if not archivo:
                return Response(
                    {"error": "No se envió archivo"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            df = pd.read_excel(archivo, header=1)

            # eliminar filas totalmente vacías
            df = df.dropna(how='all')

            # limpiar columnas
            df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

            errores = {}

            for i, row in df.iterrows():
                fila = i + 2
                fila_errores = {}

                cedula = row.get("cedula_estudiante")
                nombre1 = row.get("primer_nombre")
                apellido1 = row.get("primer_apellido")
                semestre = row.get("semestre")
                anio = row.get("año")
                periodo = row.get("periodo")

                # Cédula
                if pd.isna(cedula):
                    fila_errores.setdefault("Cedula", []).append("Cedula vacía")
                elif not isinstance(cedula, (int, float)):
                    fila_errores.setdefault("Cedula", []).append("Cedula no es numérica")

                # Nombre
                if pd.isna(nombre1) or str(nombre1).strip() == "":
                    fila_errores.setdefault("Primer nombre", []).append("Nombre vacío")

                # Apellido
                if pd.isna(apellido1) or str(apellido1).strip() == "":
                    fila_errores.setdefault("Primer apellido", []).append("Apellido vacío")

                # Semestre
                if pd.isna(semestre):
                    fila_errores.setdefault("Semestre", []).append("Semestre vacío")
                elif not isinstance(semestre, (int, float)):
                    fila_errores.setdefault("Semestre", []).append("Semestre no es numérico")
                elif not (1 <= int(semestre) <= 12):
                    fila_errores.setdefault("Semestre", []).append("Semestre fuera de rango (1-12)")

                # Cohorte - Año
                if pd.isna(anio):
                    fila_errores.setdefault("Año", []).append("Año vacío")
                elif not isinstance(anio, (int, float)):
                    fila_errores.setdefault("Año", []).append("Año no es numérico")

                # Cohorte - Periodo
                if pd.isna(periodo):
                    fila_errores.setdefault("Periodo", []).append("Periodo vacío")
                elif not isinstance(periodo, (int, float)):
                    fila_errores.setdefault("Periodo", []).append("Periodo no es numérico")
                elif int(periodo) not in [1, 2]:
                    fila_errores.setdefault("Periodo", []).append("Periodo debe ser 1 o 2")

                # Guardar si hay errores en la filas
                if fila_errores:
                    errores[fila] = fila_errores

            duplicados = df[df["cedula_estudiante"].duplicated(keep=False)]

            for i, row in duplicados.iterrows():
                fila = i + 2

                if fila not in errores:
                    errores[fila] = {}

                errores[fila].setdefault("cedula", []).append(
                    f"Cedula duplicada ({row['cedula_estudiante']})")

            if errores:
                return Response({
                    "error": "Errores en el archivo",
                    "detalles": errores
                }, status=status.HTTP_400_BAD_REQUEST)
            
            cargados = 0
            actualizados = 0
            for _, row in df.iterrows():
                cohorte, _ = CohorteIngreso.objects.get_or_create(
                    anio=int(row["año"]),
                    periodo=int(row["periodo"])
                )

                _, created = Estudiante.objects.update_or_create(
                    cedula_estudiante=int(row["cedula_estudiante"]),
                    defaults={
                        "nombre_1": capitalizar_texto(row.get("primer_nombre")),
                        "nombre_2": capitalizar_texto(row.get("segundo_nombre")),
                        "apellido_1": capitalizar_texto(row.get("primer_apellido")),
                        "apellido_2": capitalizar_texto(row.get("segundo_apellido")),
                        "semestre": int(row["semestre"]),
                        "cohorte": cohorte,
                        "cargado_por": user
                    }
                )

                if created:
                    cargados += 1
                else:
                    actualizados += 1
            
            return Response({ 
                "message": "Carga completada",
                "cargados": cargados,
                "actualizados": actualizados,
                "total": cargados + actualizados,
                }, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DashboardCoordinador(APIView):

    def get(self, request):
        try:
            user = request.user

            if not user.groups.filter(name="CoordinadorCurso").exists():
                return Response({"detail": "Acceso prohibido"}, status=403)

            curso = Cursos.objects.get(nombre=user.coordinadorcurso.curso)

            # FILTROS
            cohorte = request.GET.get("cohorte")
            profesor = request.GET.get("profesor")
            lugar = request.GET.get("lugar")
            procedimiento = request.GET.get("procedimiento")
            estudiante = request.GET.get("estudiante")

            # BASE AUTOEVALUACIONES
            base = Autoevaluacion.objects.filter(
                profesor__profesorcurso__curso=curso
            )

            if cohorte:
                base = base.filter(estudiante__cohorte_id=cohorte)

            if profesor:
                base = base.filter(profesor_id=profesor)

            if lugar:
                base = base.filter(lugar_id=lugar)

            if procedimiento:
                base = base.filter(
                    procedimientoautoevaluacion__procedimientos_id=procedimiento
                )

            if estudiante:
                base = base.filter(
                    estudiante_id=estudiante
                )

            base = base.distinct()

            # BASE ESTUDIANTES (CLAVE)
            # estudiantes_qs = Estudiante.objects.filter(
            #     autoevaluacion__profesor__profesorcurso__curso=curso
            # ).distinct()

            # if cohorte:
            #     estudiantes_qs = estudiantes_qs.filter(
            #         cohorte_id=cohorte
            #     )

            # KPIs
            total_estudiantes = (
                base.values("estudiante")
                .distinct()
                .count()
            )

            total_autoevaluaciones = base.count() or 0

            total_retroalimentaciones = (
                Retroalimentacion.objects.filter(
                    autoevaluacion__in=base
                ).count() or 0
            )

            promedio = (
                base.values("estudiante")
                .annotate(total=Count("id"))
                .aggregate(promedio=Avg("total"))["promedio"]
            )

            promedio = round(promedio, 2) if promedio else 0

            # GRAFICAS
            cohortes = (
                CohorteIngreso.objects.annotate(
                    total=Count(
                        "estudiante__autoevaluacion",
                        filter=Q(
                            estudiante__autoevaluacion__profesor__profesorcurso__curso=curso
                        )
                        & (
                            Q(estudiante__cohorte_id=cohorte)
                            if cohorte else Q()
                        )
                        & (
                            Q(estudiante__autoevaluacion__profesor_id=profesor)
                            if profesor else Q()
                        )
                        & (
                            Q(estudiante__autoevaluacion__lugar_id=lugar)
                            if lugar else Q()
                        )
                        & (
                            Q(estudiante__autoevaluacion__procedimientoautoevaluacion__procedimientos_id=procedimiento)
                            if procedimiento else Q()
                        )
                    )
                )
                .values("id", "anio", "periodo", "total")
                .order_by("anio", "periodo")
            )

            profesores = (
                Profesor.objects.filter(profesorcurso__curso=curso)
                .annotate(
                    total=Count(
                        "autoevaluacion",
                        filter=Q(autoevaluacion__in=base)
                    )
                )
                .values("id", "nombre_1", "nombre_2", "apellido_1", "apellido_2", "total")
                .order_by("nombre_1")
            )

            procedimientos = (
                Procedimientos.objects.annotate(
                    total=Count(
                        "procedimientoautoevaluacion__autoevaluacion",
                        filter=Q(
                            procedimientoautoevaluacion__autoevaluacion__profesor__profesorcurso__curso=curso
                        )
                        & (
                            Q(procedimientoautoevaluacion__autoevaluacion__estudiante__cohorte_id=cohorte)
                            if cohorte else Q()
                        )
                        & (
                            Q(procedimientoautoevaluacion__autoevaluacion__profesor_id=profesor)
                            if profesor else Q()
                        )
                        & (
                            Q(procedimientoautoevaluacion__autoevaluacion__lugar_id=lugar)
                            if lugar else Q()
                        )
                        & (
                            Q(procedimientoautoevaluacion__procedimientos_id=procedimiento)
                            if procedimiento else Q()
                        )
                    )
                )
                .values("id_procedimientos", "nombre_p", "total")
                .order_by("nombre_p")
            )

            lugares = (
                Lugar.objects.annotate(
                    total=Count(
                        "autoevaluacion",
                        filter=Q(autoevaluacion__profesor__profesorcurso__curso=curso)
                        & (Q(autoevaluacion__estudiante__cohorte_id=cohorte) if cohorte else Q())
                        & (Q(autoevaluacion__profesor_id=profesor) if profesor else Q())
                        & (Q(autoevaluacion__lugar_id=lugar) if lugar else Q())
                        & (
                            Q(autoevaluacion__procedimientoautoevaluacion__procedimientos_id=procedimiento)
                            if procedimiento else Q()
                        )
                    )
                )
                .values("id", "nombre_lugar", "total")
                .order_by("nombre_lugar")
            )

            # MATRIZ ESTUDIANTE VS PROCEDIMIENTO
            estudiantes = Estudiante.objects.filter(
                autoevaluacion__in=base
            ).distinct()

            procedimientos_matriz = Procedimientos.objects.filter(
                procedimientoautoevaluacion__autoevaluacion__in=base
            ).distinct()

            matriz = []

            # acumulador de totales por procedimiento
            totales_procedimientos = {
                procedimiento.nombre_p: 0
                for procedimiento in procedimientos_matriz
            }

            total_general = 0

            for estudiante in estudiantes:
                nombre_estudiante = (
                    f"{estudiante.nombre_1} "
                    f"{estudiante.nombre_2 or ''} "
                    f"{estudiante.apellido_1} "
                    f"{estudiante.apellido_2 or ''}"
                ).strip()

                fila = {
                    "estudiante": nombre_estudiante
                }

                total_estudiante = 0

                for procedimiento in procedimientos_matriz:
                    total = ProcedimientoAutoevaluacion.objects.filter(
                        autoevaluacion__estudiante=estudiante,
                        procedimientos=procedimiento,
                        autoevaluacion__in=base
                    ).count()

                    # columna dinámica
                    fila[procedimiento.nombre_p] = total

                    # total fila
                    total_estudiante += total

                    # total columna
                    totales_procedimientos[procedimiento.nombre_p] += total

                fila["total"] = total_estudiante
                total_general += total_estudiante

                matriz.append(fila)

            # FILA TOTAL
            fila_total = {
                "estudiante": "TOTAL"
            }

            for procedimiento in procedimientos_matriz:
                fila_total[procedimiento.nombre_p] = (
                    totales_procedimientos[procedimiento.nombre_p]
                )

            fila_total["total"] = total_general

            matriz.append(fila_total)

            return Response({
                "kpis": {
                    "total_estudiantes": total_estudiantes,
                    "total_autoevaluaciones": total_autoevaluaciones,
                    "total_retroalimentaciones": total_retroalimentaciones,
                    "promedio_autoevaluaciones_por_estudiante": promedio,
                },
                "graficas": {
                    "cohortes": list(cohortes),
                    "profesores": list(profesores),
                    "procedimientos": list(procedimientos),
                    "lugares": list(lugares),
                },
                "filtros": {
                    "cohortes": list(
                        CohorteIngreso.objects.values("id", "anio", "periodo")
                    ),
                    "profesores": list(
                        Profesor.objects.filter(profesorcurso__curso=curso)
                        .values("id", "nombre_1", "nombre_2", "apellido_1", "apellido_2")
                    ),
                    "procedimientos": list(
                        Procedimientos.objects.values("id_procedimientos", "nombre_p")
                    ),
                    "lugares": list(
                        Lugar.objects.values("id", "nombre_lugar")
                    ),
                    "estudiantes": list(
                        Estudiante.objects.filter(autoevaluacion__in=base)
                        .distinct()
                        .values("id", "nombre_1", "nombre_2", "apellido_1", "apellido_2")
                    )
                },

                # MATRIZ
                "matriz_estudiantes": matriz,

                # COLUMNAS DINAMICAS DE LA MATRIZ
                "procedimientos_matriz": [
                    {
                        "id": p.id_procedimientos,
                        "nombre": p.nombre_p
                    }
                    for p in procedimientos_matriz
                ],
            })

        except Exception as e:
            print("ERROR:", str(e))
            return Response({"error": "Error servidor"}, status=500)