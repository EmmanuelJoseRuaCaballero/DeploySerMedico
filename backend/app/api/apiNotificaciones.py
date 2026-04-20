from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from ..models import ( Notificaciones )
from ..serializers import NotificacionSerializer


class NotificacionesTodasProfesorView(APIView):
    def get(self, request):
        try:
            user = request.user

            if not request.user.is_authenticated:
                return Response(
                    {"detail": "No autenticado"}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )

            notificaciones = Notificaciones.objects.filter(user=user)
            serializer = NotificacionSerializer(notificaciones, many=True)
            no_leidas = notificaciones.filter(leida=False).count()
            return Response({
                "notificaciones": serializer.data,
                "no_leidas": no_leidas
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def patch(self, request):
        try:
            user = request.user

            if not user.groups.filter(name="Profesor").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            Notificaciones.objects.filter(user=user, leida=False).update(leida=True)
            return Response(
                {"message": "Todas marcadas como leídas"}, 
                status=status.HTTP_200_OK
            )
        
        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


    def delete(self, request):
        try:
            user = request.user

            if not user.groups.filter(name="Profesor").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )

            Notificaciones.objects.filter(user=user).delete()
            return Response(
                {"message": "Notificaciones eliminadas"}, 
                status=status.HTTP_200_OK
            )
        
        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class NotificacionIndividualProfesorView(APIView):
    def patch(self, request, id):
        try:
            user = request.user

            if not user.groups.filter(name="Profesor").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            try:
                notif = Notificaciones.objects.get(id=id, user=user)
                notif.leida = True
                notif.save()
                return Response(
                    {"message": "Notificación marcada como leída"}, 
                    status=status.HTTP_200_OK
                )
            except Notificaciones.DoesNotExist:
                return Response(
                    {"error": "No encontrada"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, id):
        try:
            user = request.user

            if not user.groups.filter(name="Profesor").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )

            try:
                notif = Notificaciones.objects.get(id=id, user=user)
                notif.delete()
                return Response(
                    {"message": "Eliminada"}, 
                    status=status.HTTP_200_OK
                )
            except Notificaciones.DoesNotExist:
                return Response(
                    {"error": "No encontrada"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class NotificacionesTodasEstudianteView(APIView):
    def get(self, request):
        try:
            user = request.user

            if not request.user.is_authenticated:
                return Response(
                    {"detail": "No autenticado"}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )

            notificaciones = Notificaciones.objects.filter(user=user)
            serializer = NotificacionSerializer(notificaciones, many=True)
            no_leidas = notificaciones.filter(leida=False).count()
            return Response({
                "notificaciones": serializer.data,
                "no_leidas": no_leidas
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def patch(self, request):
        try:
            user = request.user

            if not user.groups.filter(name="Estudiante").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            Notificaciones.objects.filter(user=user, leida=False).update(leida=True)
            return Response(
                {"message": "Todas marcadas como leídas"}, 
                status=status.HTTP_200_OK
            )
        
        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


    def delete(self, request):
        try:
            user = request.user

            if not user.groups.filter(name="Estudiante").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )

            Notificaciones.objects.filter(user=user).delete()
            return Response(
                {"message": "Notificaciones eliminadas"}, 
                status=status.HTTP_200_OK
            )
        
        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class NotificacionIndividualEstudianteView(APIView):
    def patch(self, request, id):
        try:
            user = request.user

            if not user.groups.filter(name="Estudiante").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            try:
                notif = Notificaciones.objects.get(id=id, user=user)
                notif.leida = True
                notif.save()
                return Response(
                    {"message": "Notificación marcada como leída"}, 
                    status=status.HTTP_200_OK
                )
            except Notificaciones.DoesNotExist:
                return Response(
                    {"error": "No encontrada"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, id):
        try:
            user = request.user

            if not user.groups.filter(name="Estudiante").exists():
                return Response(
                    {"detail": "Acceso prohibido (rol)"},
                    status=status.HTTP_403_FORBIDDEN
                )

            try:
                notif = Notificaciones.objects.get(id=id, user=user)
                notif.delete()
                return Response(
                    {"message": "Eliminada"}, 
                    status=status.HTTP_200_OK
                )
            except Notificaciones.DoesNotExist:
                return Response(
                    {"error": "No encontrada"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        except Exception as e:
            print("error", str(e))
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
