from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Recebimento
from .serializers import RecebimentoSerializer
from django_filters.rest_framework import DjangoFilterBackend

class RecebimentoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar os registros de recebimento de cargas.
    """
    queryset = Recebimento.objects.all()
    serializer_class = RecebimentoSerializer
    permission_classes = [AllowAny] # Permite acesso total sem autenticação
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['carga', 'receptor'] # Permite filtrar por /recebimentos/?carga=1
