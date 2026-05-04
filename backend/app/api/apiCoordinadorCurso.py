from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
from django.contrib.auth.models import Group, User
import pandas as pd

from ..models import (
    CohorteIngreso,
    Estudiante
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
