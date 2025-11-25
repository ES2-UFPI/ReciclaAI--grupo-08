from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from usuarios.views import UsuarioViewSet
from residuos.views import ResiduoViewSet
from carga.views import CargaResiduoViewSet, CargaViewSet
from coleta.views import ColetaViewSet

router = DefaultRouter()

router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'residuos', ResiduoViewSet, basename='residuo')
router.register(r'cargas', CargaViewSet, basename='cargas')
router.register(r'carga-residuos', CargaResiduoViewSet, basename='cargaresiduo')
router.register(r'coleta', ColetaViewSet, basename='coleta')

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(router.urls)),
]
