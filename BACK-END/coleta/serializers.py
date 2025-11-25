from rest_framework import serializers
from .models import Coleta

class ColetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coleta
        fields = ["id", "coletor", "carga", "data_coleta"]