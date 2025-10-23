from rest_framework import serializers
from .models import Usuario, Produtor, Coletor, Receptor
from django.db import transaction


class ProdutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produtor
        fields = [] 


class ColetorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coletor
        fields = ['tipo_veiculo', 'capacidade_carga']


class ReceptorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receptor
        fields = ['nome_empresa', 'cnpj', 'endereco_comercial', 'horario_funcionamento', 'tipos_de_residuo_aceitos']


class UsuarioSerializer(serializers.ModelSerializer):
    perfil_produtor = ProdutorSerializer(required=False, write_only=True)
    perfil_coletor = ColetorSerializer(required=False, write_only=True)
    perfil_receptor = ReceptorSerializer(required=False, write_only=True)

    class Meta:
        model = Usuario
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'password',
            'tipo_usuario', 'cpf', 'data_nascimento', 'telefone', 'endereco_completo',
            'perfil_produtor', 'perfil_coletor', 'perfil_receptor' # Campos de escrita
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    @transaction.atomic
    def create(self, validated_data):
        
        produtor_data = validated_data.pop('perfil_produtor', None)
        coletor_data = validated_data.pop('perfil_coletor', None)
        receptor_data = validated_data.pop('perfil_receptor', None)

        
        usuario = Usuario.objects.create_user(**validated_data)

        
        if usuario.tipo_usuario == Usuario.TipoUsuario.PRODUTOR:
            Produtor.objects.create(usuario=usuario, **(produtor_data or {}))
        elif usuario.tipo_usuario == Usuario.TipoUsuario.COLETOR and coletor_data:
            Coletor.objects.create(usuario=usuario, **coletor_data)
        elif usuario.tipo_usuario == Usuario.TipoUsuario.RECEPTOR and receptor_data:
            Receptor.objects.create(usuario=usuario, **receptor_data)

        return usuario

    @transaction.atomic
    def update(self, instance, validated_data):
        # Extrai os dados dos perfis
        produtor_data = validated_data.pop('perfil_produtor', None)
        coletor_data = validated_data.pop('perfil_coletor', None)
        receptor_data = validated_data.pop('perfil_receptor', None)

        # Atualiza os campos do próprio usuário
        instance = super().update(instance, validated_data)

        # Atualiza o perfil correspondente, se os dados foram enviados
        if instance.tipo_usuario == Usuario.TipoUsuario.COLETOR and coletor_data:
            if hasattr(instance, 'perfil_coletor'):
                profile = instance.perfil_coletor
                for attr, value in coletor_data.items():
                    setattr(profile, attr, value)
                profile.save()

        elif instance.tipo_usuario == Usuario.TipoUsuario.RECEPTOR and receptor_data:
            if hasattr(instance, 'perfil_receptor'):
                profile = instance.perfil_receptor
                for attr, value in receptor_data.items():
                    setattr(profile, attr, value)
                profile.save()

        return instance

class UsuarioReadOnlySerializer(UsuarioSerializer):
    perfil_produtor = ProdutorSerializer(read_only=True)
    perfil_coletor = ColetorSerializer(read_only=True)
    perfil_receptor = ReceptorSerializer(read_only=True)