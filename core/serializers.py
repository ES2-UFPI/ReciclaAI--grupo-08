from rest_framework import serializers
from .models import (
    Usuario, Residuo, Carga, CargaResiduo, Coleta,
    Avaliacao, Pontos, Recebimento, UsuarioResiduo
)


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'


class ResiduoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Residuo
        fields = '__all__'


class CargaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carga
        fields = '__all__'


class CargaResiduoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CargaResiduo
        fields = '__all__'


class ColetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coleta
        fields = '__all__'


class AvaliacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avaliacao
        fields = '__all__'


class PontosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pontos
        fields = '__all__'


class RecebimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recebimento
        fields = '__all__'


class UsuarioResiduoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioResiduo
        fields = '__all__'
