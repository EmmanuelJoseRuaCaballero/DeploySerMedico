from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
import os

from ..models import ( FotoPerfil )

class FotoPerfilView(APIView):

    def get(self, request):
        try:
            user = request.user

            if hasattr(user, "foto_perfil") and user.foto_perfil.foto_perfil:
                url = request.build_absolute_uri(
                    user.foto_perfil.foto_perfil.url
                )
            else:
                url = None

            return Response(
                {"foto_perfil": url},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        try:
            user = request.user
            foto = request.FILES.get("foto_perfil")

            if not foto:
                return Response(
                    {"error": "No se envió ninguna imagen"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not foto.content_type.startswith("image/"):
                return Response(
                    {"error": "El archivo debe ser una imagen"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if foto.size > 5 * 1024 * 1024:
                return Response(
                    {"error": "La imagen no puede superar 5 MB"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if foto:
                ext = os.path.splitext(foto.name)[1]  # .jpg, .png, etc
                foto.name = f"user_{request.user.id}{ext}"

            perfil, _ = FotoPerfil.objects.get_or_create(user=user)

            if perfil.foto_perfil:
                perfil.foto_perfil.delete(save=False)

            perfil.foto_perfil = foto
            perfil.save()

            perfil = FotoPerfil.objects.get(user=user)

            url = None
            if perfil.foto_perfil and hasattr(perfil.foto_perfil, "url"):
                url = request.build_absolute_uri(perfil.foto_perfil.url)

            return Response(
                {
                    "foto_perfil": url,
                    "message": "Foto actualizada correctamente"
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def delete(self, request):
        try:
            user = request.user
            perfil = FotoPerfil.objects.get(user=user)
            
            if perfil:
                perfil.foto_perfil.delete(save=False)
                perfil.foto_perfil = None
                perfil.save()
            return Response(
                {"message": "Foto eliminada"}, 
                status=status.HTTP_200_OK
            )
        except perfil.DoesNotExist:
            return Response(
                {"error": "Usuario no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )