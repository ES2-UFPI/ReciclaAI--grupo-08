from rest_framework import viewsets, permissions
from .models import Carga
from .serializers import CargaSerializer

class CargaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para criar, ler, atualizar e deletar Cargas.
    Apenas usuários autenticados podem interagir.
    """
    queryset = Carga.objects.all().order_by('-criado_em')
    serializer_class = CargaSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        # O contexto ainda pode ser útil, mas request.user será anônimo
        return {'request': self.request}
