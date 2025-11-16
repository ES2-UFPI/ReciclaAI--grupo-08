from rest_framework import serializers
from .models import Residuo


class ResiduoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Residuo
        fields = ['id', 'tipo', 'valor', 'descricao', 'data_criacao']
        read_only_fields = ['data_criacao']

    def validate_valor(self, value):
        """Verifica se o valor não é negativo."""
        if value < 0:
            raise serializers.ValidationError("O valor não pode ser negativo.")
        return value
