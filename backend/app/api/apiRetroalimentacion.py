from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from ..models import (
    Autoevaluacion,
    BorradorRetroalimentacion,
    Notificaciones,
    Retroalimentacion
)

class RetroalimentacionView(APIView):
    """
    API Retroalimentacion
    """
    def post(self, request):
        """
        Crea la retroalimentacion para el estudiante

        Args:
            request (Request): objeto con los datos enviados en el body
        Body:
            nivel_desempeño (int): nivel de desempeño del estudiante
            observaciones (string): observaciones del estudiante
            id_autoevaluacion (int): id de la autoevaluacion
            id_borrador_retroalimentacion (int): id del borrador de retroalimentacion
        Returns:
            Response:
                201: Crear retroalimentacion
                500: Error interno del servidor
        """
        try:
            user = request.user

            if not user.groups.filter(name="Profesor").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )

            profesor = user.profesor

            nivel_desempeño = request.data.get("nivel_desempeño")
            observaciones = request.data.get("observaciones")
            autoevaluacion_id = request.data.get("autoevaluacion_id")  
            id_borrador_retroalimentacion = request.data.get("id_borrador_retroalimentacion")

            # Elegir el nivel de desempeño
            if nivel_desempeño == 1:
                desempeño = "Novato"
            elif nivel_desempeño == 2:
                desempeño = "Principiante Avanzado"
            elif nivel_desempeño == 3:
                desempeño = "Competente"
            elif nivel_desempeño == 4:
                desempeño = "Profesional"
            elif nivel_desempeño == 5:
                desempeño = "Experto"

            retroalimentacion = Retroalimentacion.objects.create(
                nivel_desempeño=desempeño,
                observaciones=observaciones,
                autoevaluacion_id=autoevaluacion_id
            )

            estudiante_profesor = Autoevaluacion.objects.get(
                id=autoevaluacion_id
            )

            # Notificar al estudiante que recibió una nueva retroalimentacion.
            if estudiante_profesor:
                nombre_estudiante = (
                    f"{estudiante_profesor.profesor.nombre_1} "
                    f"{estudiante_profesor.profesor.nombre_2} "
                    f"{estudiante_profesor.profesor.apellido_1} "
                    f"{estudiante_profesor.profesor.apellido_2} "
                ).strip()
                Notificaciones.objects.create(
                    user=estudiante_profesor.estudiante.user,
                    titulo="Nueva retroalimentación recibida",
                    mensaje=(
                        f"{nombre_estudiante} registró una retroalimentación "
                        f"el {retroalimentacion.fecha}."
                    ),
                    tipo="info"
                )

            # Eliminar el borrador, si existe
            if id_borrador_retroalimentacion:
                BorradorRetroalimentacion.objects.get(
                    id=id_borrador_retroalimentacion
                ).delete()

            return Response(
                {"message": "Retroalimetacion Enviada"},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )