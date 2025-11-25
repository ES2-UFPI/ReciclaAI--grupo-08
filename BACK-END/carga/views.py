# cargas/views.py
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Carga, CargaResiduo
from .serializers import CargaSerializer, CargaResiduoSerializer


class CargaViewSet(viewsets.ModelViewSet):
    queryset = Carga.objects.all().select_related("produtor")
    serializer_class = CargaSerializer
    permission_classes = [permissions.AllowAny]

    # não força mais produtor = request.user
    # front pode mandar o produtor direto no payload

    @action(detail=True, methods=["post"], url_path="recalcular-valor")
    def recalcular_valor(self, request, pk=None):
        """
        POST /cargas/{id}/recalcular-valor/
        Recalcula o valor_total da carga a partir dos itens.
        """
        carga = self.get_object()
        carga.recalcular_valor_total()
        serializer = self.get_serializer(carga)
        return Response(serializer.data)


class CargaResiduoViewSet(viewsets.ModelViewSet):
    queryset = CargaResiduo.objects.all().select_related("carga", "residuo")
    serializer_class = CargaResiduoSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """
        Opcional: ?carga=ID pra filtrar os itens de uma carga específica.
        """
        qs = super().get_queryset()
        carga_id = self.request.query_params.get("carga")
        if carga_id is not None:
            qs = qs.filter(carga_id=carga_id)
        return qs
