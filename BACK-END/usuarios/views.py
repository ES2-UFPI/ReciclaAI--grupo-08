from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Usuario
from .serializers import UsuarioSerializer, UsuarioReadOnlySerializer
from django_filters.rest_framework import DjangoFilterBackend

class UsuarioListCreateView(generics.ListCreateAPIView):

    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny] 
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tipo_usuario']

class UsuarioDetailView(generics.RetrieveUpdateDestroyAPIView):
    
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UsuarioSerializer
        return UsuarioReadOnlySerializer
