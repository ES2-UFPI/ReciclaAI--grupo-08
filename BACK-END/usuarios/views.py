from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Usuario
from rest_framework.pagination import PageNumberPagination
from .serializers import UsuarioSerializer, UsuarioReadOnlySerializer
from django_filters.rest_framework import DjangoFilterBackend

class UsuarioViewSet(viewsets.ModelViewSet):

    queryset = Usuario.objects.all().order_by('id')
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tipo_usuario']

    def get_serializer_class(self):
        # Para leitura (list, retrieve), usa um serializer que mostra os perfis.
        if self.action in ['list', 'retrieve']:
            return UsuarioReadOnlySerializer
        return UsuarioSerializer
