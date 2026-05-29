from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    Estudiante
) 

class EstudianteView(APIView):
    # Retorna listado todos los estudiantes
    def get(self, request):
        try:
            estudiantes = Estudiante.objects.all().order_by("cedula_estudiante")

            lista_estudiantes = []
            for estudiante in estudiantes:
                lista_estudiantes.append({
                    "cedula_estudiante": estudiante.cedula_estudiante,
                    "nombre": " ".join(filter(None, [
                        estudiante.nombre_1,
                        estudiante.nombre_2,
                        estudiante.apellido_1,
                        estudiante.apellido_2,
                    ])),
                    "semestre": estudiante.semestre,
                    "estado": estudiante.estado,
                })

            return Response(
                lista_estudiantes, 
                status=status.HTTP_200_OK
            )

        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    # Actualizar estado del estudiante
    def patch(self, request):
        try:
            user = request.user
            data = request.data

            if not user.groups.filter(name="Profesor").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )

            for item in data:
                cedula_estudiante = item.get("cedula_estudiante")
                nuevo_estado = item.get("nuevo_estado")

                estudiante = Estudiante.objects.filter(cedula_estudiante=cedula_estudiante).first()

                if estudiante:
                    estudiante.estado = nuevo_estado
                    estudiante.save()

            return Response(
                {"message": "Estado actualizado correctamente"},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            print("error", str(e))
            return Response(
                {"error": "Error interno del servidor"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ValidacionEstudianteView(APIView):
    def post(self, request):
        try:
            user = request.user

            if not user.groups.filter(name="Estudiante").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            estudiante = user.estudiante

            nuevo_estado = request.data.get("nuevo_estado")

            estado_estudiante = Estudiante.objects.filter(cedula_estudiante=estudiante.cedula_estudiante).first()

            if estado_estudiante:
                    estado_estudiante.estado = nuevo_estado
                    estado_estudiante.save()
            
            return Response(
                status=status.HTTP_200_OK
            )
        
        except Exception as e:
            print("error", str(e))
            return Response(
                {"error": "Error interno del servidor"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    # Verificar el estado del estudiante
    def get(self, request):
        try:
            user = request.user

            if not user.groups.filter(name="Estudiante").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            estudiante = user.estudiante

            estado = Estudiante.objects.get(cedula_estudiante=estudiante.cedula_estudiante).estado

            return Response(
                {"estado": estado},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print("error", str(e))
            return Response(
                {"error": "Error interno del servidor"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
