from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet, ResiduoViewSet, CargaViewSet, CargaResiduoViewSet,
    ColetaViewSet, AvaliacaoViewSet, PontosViewSet, RecebimentoViewSet,
    UsuarioResiduoViewSet, UsuarioRatingView
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'residuos', ResiduoViewSet)
router.register(r'cargas', CargaViewSet)
router.register(r'carga-residuos', CargaResiduoViewSet)
router.register(r'coletas', ColetaViewSet)
router.register(r'avaliacoes', AvaliacaoViewSet)
router.register(r'pontos', PontosViewSet)
router.register(r'recebimentos', RecebimentoViewSet)
router.register(r'usuario-residuos', UsuarioResiduoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path("usuarios/<int:user_id>/rating/", UsuarioRatingView.as_view(), name="usuario-rating"),
]
