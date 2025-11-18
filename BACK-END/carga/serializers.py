from rest_framework import serializers
from django.db.models import Sum
from .models import Carga
from residuos.models import Residuo
from residuos.serializers import ResiduoSerializer

class CargaSerializer(serializers.ModelSerializer):
    # Usamos um serializer de resíduo para mostrar os detalhes ao ler uma carga
    residuos = ResiduoSerializer(many=True, read_only=True)
    # Para escrita, aceitamos uma lista de IDs de resíduos
    residuos_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=Residuo.objects.all(), source='residuos'
    )

    class Meta:
        model = Carga
        fields = [
            'id', 'produtor', 'residuos', 'residuos_ids', 'valor_total',
            'status', 'criado_em', 'entregue_em'
        ]
        read_only_fields = ['valor_total', 'produtor', 'criado_em']

    def create(self, validated_data):
        # Associa o produtor logado automaticamente (será feito na view)
        validated_data['produtor'] = self.context['request'].user

        return super().create(validated_data)