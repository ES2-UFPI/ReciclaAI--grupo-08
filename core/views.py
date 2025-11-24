from django.db import models
from django.utils import timezone
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

    @action(detail=False, methods=['post'], url_path='solicitar')
    def solicitar_coleta(self, request):
        coletor_id = request.data.get("coletor")
        carga_id = request.data.get("carga")

        if not coletor_id or not carga_id:
            return Response(
                {"detail": "coletor e carga são obrigatórios."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            coletor = Usuario.objects.get(id=coletor_id)
            carga = Carga.objects.get(id=carga_id)
        except Usuario.DoesNotExist:
            return Response({"detail": "Coletor não encontrado."}, status=404)
        except Carga.DoesNotExist:
            return Response({"detail": "Carga não encontrada."}, status=404)

        coleta = Coleta.objects.create(
            coletor=coletor,
            carga=carga,
            status="pendente",
            data_coleta=timezone.now()
        )

        serializer = self.get_serializer(coleta)
        return Response(serializer.data, status=201) 
    
    @action(detail=False, methods=['get'], url_path='disponiveis')
    def listar_disponiveis(self, request):
        coletas = Coleta.objects.filter(
            coletor__isnull=True,
        ).filter(
            models.Q(status="pendente") | models.Q(status__isnull=True)
        )

        serializer = self.get_serializer(coletas, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='aceitar')
    def aceitar_coleta(self, request, pk=None):
        try:
            coleta = Coleta.objects.get(id=pk)
        except Coleta.DoesNotExist:
            return Response({"detail": "Coleta não encontrada."}, status=404)

        coletor_id = request.data.get("coletor")

        if not coletor_id:
            return Response({"detail": "ID do coletor é obrigatório."}, status=400)

        try:
            coletor = Usuario.objects.get(id=coletor_id)
        except Usuario.DoesNotExist:
            return Response({"detail": "Coletor não encontrado."}, status=404)

        if coleta.status != "pendente" or coleta.coletor is not None:
            return Response({"detail": "Coleta não está disponível para aceitação."}, status=400)

        coleta.coletor = coletor
        coleta.status = "agendada"
        coleta.data_coleta = timezone.now()
        coleta.save()

        serializer = self.get_serializer(coleta)
        return Response(serializer.data, status=200)
    
    @action(detail=True, methods=['post'], url_path='confirmar-retirada')
    def confirmar_retirada(self, request, pk=None):
        try:
            coleta = Coleta.objects.get(id=pk)
        except Coleta.DoesNotExist:
            return Response({"detail": "Coleta não encontrada."}, status=404)

        if coleta.status != "agendada":
            return Response({"detail": "Coleta não está agendada."}, status=400)

        coleta.status = "em_transito"
        coleta.save()

        serializer = self.get_serializer(coleta)
        return Response(serializer.data, status=200)
    
    @action(detail=True, methods=['post'], url_path='confirmar-entrega')
    def confirmar_entrega(self, request, pk=None):
        try:
            coleta = Coleta.objects.get(id=pk)
        except Coleta.DoesNotExist:
            return Response({"detail": "Coleta não encontrada."}, status=404)

        if coleta.status != "em_transito":
            return Response({"detail": "Coleta não está em trânsito."}, status=400)

        coleta.status = "finalizada"
        coleta.save()

        serializer = self.get_serializer(coleta)
        return Response(serializer.data, status=200)




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