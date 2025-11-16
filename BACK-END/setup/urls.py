from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from usuarios.views import UsuarioViewSet
from residuos.views import ResiduoViewSet

router = DefaultRouter()

router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'residuos', ResiduoViewSet, basename='residuo')

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(router.urls)),
]
