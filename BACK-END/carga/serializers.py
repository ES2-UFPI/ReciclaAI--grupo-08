# cargas/serializers.py
from rest_framework import serializers
from .models import Carga, CargaResiduo
from residuos.models import Residuo


class CargaResiduoSerializer(serializers.ModelSerializer):
    # opcional: mostrar info do resíduo
    residuo_nome = serializers.CharField(source="residuo.tipo", read_only=True)
    residuo_valor = serializers.DecimalField(
        source="residuo.valor",
        read_only=True,
        max_digits=10,
        decimal_places=2,
    )

    class Meta:
        model = CargaResiduo
        fields = [
            "id",
            "carga",
            "residuo",
            "residuo_nome",
            "residuo_valor",
            "peso_kg",
            "valor",
        ]
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
    produtor_nome = serializers.CharField(source="produtor.get_full_name", read_only=True)
    carga_residuos = CargaResiduoSerializer(many=True, read_only=True, source="itens")
    peso_total_kg = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = Carga
        fields = [
            "id",
            "produtor",
            "produtor_nome",
            "valor_total",
            "status",
            "criado_em",
            "entregue_em",
            "peso_total_kg",
            "carga_residuos",
        ]
        read_only_fields = ["valor_total", "criado_em", "entregue_em", "peso_total_kg"]
