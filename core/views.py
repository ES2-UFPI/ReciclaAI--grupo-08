from rest_framework.views import APIView
from rest_framework import status
from django.db.models import Avg
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    Usuario, Residuo, Carga, CargaResiduo, Coleta,
    Avaliacao, Pontos, Recebimento, UsuarioResiduo
)
from .serializers import (
    UsuarioSerializer, ResiduoSerializer, CargaSerializer,
    CargaResiduoSerializer, ColetaSerializer, AvaliacaoSerializer,
    PontosSerializer, RecebimentoSerializer, UsuarioResiduoSerializer
)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    @action(detail=False, methods=['get'], url_path='produtores')
    def produtores(self, request):
        usuarios = Usuario.objects.filter(tipo_usuario="produtor")
        serializer = self.get_serializer(usuarios, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='coletores')
    def coletores(self, request):
        usuarios = Usuario.objects.filter(tipo_usuario="coletor")
        serializer = self.get_serializer(usuarios, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='receptores')
    def receptores(self, request):
        usuarios = Usuario.objects.filter(tipo_usuario="receptor")
        serializer = self.get_serializer(usuarios, many=True)
        return Response(serializer.data)


class ResiduoViewSet(viewsets.ModelViewSet):
    queryset = Residuo.objects.all()
    serializer_class = ResiduoSerializer


class CargaViewSet(viewsets.ModelViewSet):
    queryset = Carga.objects.all()
    serializer_class = CargaSerializer


class CargaResiduoViewSet(viewsets.ModelViewSet):
    queryset = CargaResiduo.objects.all()
    serializer_class = CargaResiduoSerializer


class ColetaViewSet(viewsets.ModelViewSet):
    queryset = Coleta.objects.all()
    serializer_class = ColetaSerializer


class AvaliacaoViewSet(viewsets.ModelViewSet):
    queryset = Avaliacao.objects.all()
    serializer_class = AvaliacaoSerializer


class PontosViewSet(viewsets.ModelViewSet):
    queryset = Pontos.objects.all()
    serializer_class = PontosSerializer


class RecebimentoViewSet(viewsets.ModelViewSet):
    queryset = Recebimento.objects.all()
    serializer_class = RecebimentoSerializer


class UsuarioResiduoViewSet(viewsets.ModelViewSet):
    queryset = UsuarioResiduo.objects.all()
    serializer_class = UsuarioResiduoSerializer

class UsuarioRatingView(APIView):
       def get(self, request, user_id):
        try:
            usuario = Usuario.objects.get(pk=user_id)
        except Usuario.DoesNotExist:
            return Response(
                {"detail": "Usuário não encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        avaliacoes = Avaliacao.objects.filter(avaliado=usuario)

        if not avaliacoes.exists():
            return Response({"avaliacao_media": 0.0})

        media = avaliacoes.aggregate(avg=Avg("nota"))["avg"]


        return Response({"avaliacao_media": round(float(media), 2)})