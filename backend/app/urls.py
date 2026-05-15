from django.urls import path

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from app.api.apiPerfil import PerfilView
from app.api.apiProcedimientos import ProcedimientosView
from app.api.apiLugar import LugarView
from app.api.apiCoordinadorCurso import CargarEstudiantes, DashboardCoordinador
from app.api.apiProfesor import ProfesorView, ValidacionProfesorView
from app.api.apiEstudiante import EstudianteView, ValidacionEstudianteView
from app.api.apiAutoevaluacion import AutoevaluacionEstudianteView, AutoevaluacionProfesorView, UltimasAutoevaluacionesEstudianteView
from app.api.apiRetroalimentacion import RetroalimentacionView, UltimasRetroalimentacionesProfesorView
from app.api.apiBorradorAutoevaluacion import BorradorAutoevaluacionView
from app.api.apiBorradorRetroalimentacion import BorradorRetroalimentacionView
from app.api.apiEstadisticasProcedimientos import EstadisticasProcedimientosProfesorView, TablaProcedimientosEstudianteView, TablaProcedimientosProfesorView, EstadisticasProcedimientosEstudiantesView
from app.api.apiCurvaAprendizaje import CurvaAprendizajeEstudianteView, CurvaAprendizajeProfesorView
from app.api.apiFotoPerfil import FotoPerfilView
from app.api.apiNotificaciones import NotificacionIndividualEstudianteView, NotificacionIndividualProfesorView, NotificacionesTodasEstudianteView, NotificacionesTodasProfesorView

urlpatterns = [
    # Login - Token
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    # Perfil
    path("api/perfil/", PerfilView.as_view(), name="perfil"),
    # Procedimientos
    path("api/procedimientos/", ProcedimientosView.as_view(), name="procedimientos"),
    # Lugar
    path("api/lugar/", LugarView.as_view(), name="lugar"),
    # Coordinador Cursos
    path("api/cargarestudiantes/coordinadorcurso/", CargarEstudiantes.as_view(), name="cargarestudiantes_coordinadorcurso"),
    path("api/dashboard/coordinadorcurso/", DashboardCoordinador.as_view(), name="dashboard_coordinadorcurso"),
    # Profesor
    path("api/profesor/", ProfesorView.as_view(), name="profesor"),
    path("api/validacionprofesor/", ValidacionProfesorView.as_view(), name="validacionprofesor"),
    # Estudiante
    path("api/estudiante/", EstudianteView.as_view(), name="estudiante"),
    path("api/validacionestudiante/", ValidacionEstudianteView.as_view(), name="validacionestudiante"),
    # Autoevaluacion
    path("api/autoevaluacion/estudiante/", AutoevaluacionEstudianteView.as_view(), name="autoevaluacion_estudiante"),
    path("api/autoevaluacion/profesor/", AutoevaluacionProfesorView.as_view(), name="autoevaluacion_profesor"),
    path("api/ultimasautoevaluaciones/estudiante/", UltimasAutoevaluacionesEstudianteView.as_view(), name="ultimasautoevaluaciones"),
    # Retroalimentacion
    path("api/retroalimentacion/", RetroalimentacionView.as_view(), name="retroalimentacion"),
    path("api/ultimasretroalimentaciones/profesor/", UltimasRetroalimentacionesProfesorView.as_view(), name="ultimasretroalimentaciones"),
    # BorradorAutoevaluacion
    path("api/borradorautoevaluacion/", BorradorAutoevaluacionView.as_view(), name="borradorautoevaluacion"),
    # BorradorRetroalimentacion
    path("api/borradorretroalimentacion/", BorradorRetroalimentacionView.as_view(), name="borradorretroalimentacion"),
    # Estadisticas Procediminentos
    path("api/tablaprocedimientos/estudiante/", TablaProcedimientosEstudianteView.as_view(), name="tablaprocedimientos"),
    path("api/tablaprocedimientos/profesor/", TablaProcedimientosProfesorView.as_view(), name="tablaprocedimientos"),
    path("api/estadisticasprocedimientos/estudiante/", EstadisticasProcedimientosEstudiantesView.as_view(), name="estadisticasprocedimientos_estudiante"),
    path("api/estadisticasprocedimientos/profesor/", EstadisticasProcedimientosProfesorView.as_view(), name="estadisticasprocedimientos_profesor"),
    # Curva Aprendizaje
    path("api/curvaaprendizaje/estudiante/", CurvaAprendizajeEstudianteView.as_view(), name="curvaaprendizaje_estudiante"),
    path("api/curvaaprendizaje/profesor/", CurvaAprendizajeProfesorView.as_view(), name="curvaaprendizaje_profesor"),
    # Foto Perfil
    path("api/fotoperfil/", FotoPerfilView.as_view(), name="foto_perfil"),
    # Notificaciones
    path("api/notificaciones/profesor/", NotificacionesTodasProfesorView.as_view(), name="notificaciones_todas_profesor"),
    path("api/notificaciones/profesor/<int:id>/", NotificacionIndividualProfesorView.as_view(), name="notificacion_individual_profesor"),
    path("api/notificaciones/estudiante/", NotificacionesTodasEstudianteView.as_view(), name="notificaciones_todas_estudiante"),
    path("api/notificaciones/estudiante/<int:id>/", NotificacionIndividualEstudianteView.as_view(), name="notificacion_individual_estudiante"),
]