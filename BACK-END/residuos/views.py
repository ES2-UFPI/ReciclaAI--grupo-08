from rest_framework import viewsets, permissions
from rest_framework.pagination import PageNumberPagination
from .models import Residuo
from .serializers import ResiduoSerializer


class ResiduoViewSet(viewsets.ModelViewSet):
    queryset = Residuo.objects.all().order_by('-data_criacao')
    serializer_class = ResiduoSerializer
    pagination_class = PageNumberPagination
    permission_classes = [permissions.AllowAny] # Acesso livre por enquanto
