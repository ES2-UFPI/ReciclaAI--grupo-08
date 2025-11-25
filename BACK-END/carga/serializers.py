# cargas/serializers.py
from rest_framework import serializers
from .models import Carga, CargaResiduo


class CargaResiduoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CargaResiduo
        fields = ["id", "carga", "residuo", "peso_kg", "valor"]
        read_only_fields = ["valor"]

    def create(self, validated_data):
        """
        Quando criar um CargaResiduo, calcula o valor = peso_kg * residuo.valor_kg
        e atualiza o valor_total da carga.
        """
        residuo = validated_data["residuo"]
        peso_kg = validated_data["peso_kg"]
        valor = peso_kg * residuo.valor
        validated_data["valor"] = valor
        carga_residuo = super().create(validated_data)
        carga_residuo.carga.recalcular_valor_total()
        return carga_residuo

    def update(self, instance, validated_data):
        """
        Se atualizar peso_kg ou residuo, recalcula valor e valor_total.
        """
        residuo = validated_data.get("residuo", instance.residuo)
        peso_kg = validated_data.get("peso_kg", instance.peso_kg)
        instance.residuo = residuo
        instance.peso_kg = peso_kg
        instance.valor = peso_kg * residuo.valor
        instance.save()
        instance.carga.recalcular_valor_total()
        return instance


class CargaSerializer(serializers.ModelSerializer):
    itens = CargaResiduoSerializer(many=True, read_only=True)
    peso_total_kg = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = Carga
        fields = [
            "id",
            "produtor",
            "valor_total",
            "criado_em",
            "peso_total_kg",
            "itens",
        ]
        read_only_fields = ["valor_total", "criado_em", "peso_total_kg", "itens"]
