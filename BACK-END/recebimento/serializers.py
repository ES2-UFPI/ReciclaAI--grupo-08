from rest_framework import serializers
from .models import Recebimento
from usuarios.models import Usuario
from carga.models import Carga

class RecebimentoSerializer(serializers.ModelSerializer):
    # Sobrescrevemos os campos para controlar a validação.
    # queryset=Usuario.objects.all() remove a restrição do limit_choices_to na validação do serializer.
    receptor = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all())
    # Removemos o validador de unicidade padrão do DRF para que o nosso seja usado.
    carga = serializers.PrimaryKeyRelatedField(queryset=Carga.objects.all(), validators=[])

    class Meta:
        model = Recebimento
        fields = ['id', 'carga', 'receptor', 'data_recebimento', 'peso_conferido_kg']
        read_only_fields = ['id', 'data_recebimento']

    def validate(self, data):
        """
        Validações de negócio para o recebimento.
        """
        carga = data.get('carga')
        receptor = data.get('receptor')

        # 1. Verifica se o usuário informado é realmente um Receptor.
        if receptor and receptor.tipo_usuario != Usuario.TipoUsuario.RECEPTOR:
            raise serializers.ValidationError({"receptor": "O usuário informado não é do tipo RECEPTOR."})

        # 2. Verifica se a carga já não foi recebida.
        if carga and Recebimento.objects.filter(carga=carga).exists():
            raise serializers.ValidationError({"carga": "Esta carga já possui um registro de recebimento."})

        return data