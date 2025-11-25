from rest_framework import serializers
from .models import Usuario, Produtor, Coletor, Receptor
from django.db import transaction
from .validators import validate_cpf, validate_cnpj


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
        extra_kwargs = {
            'cnpj': {'validators': [validate_cnpj]}
        }


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
            'password': {'write_only': True},
            'cpf': {'validators': [validate_cpf]}
        }

    @transaction.atomic
    def create(self, validated_data):
        
        produtor_data = validated_data.pop('perfil_produtor', None)
        coletor_data = validated_data.pop('perfil_coletor', None)
        receptor_data = validated_data.pop('perfil_receptor', None)

        
        usuario = Usuario.objects.create_user(**validated_data)

        
        if usuario.tipo_usuario == Usuario.TipoUsuario.PRODUTOR and produtor_data is not None:
            Produtor.objects.create(usuario=usuario, **produtor_data)
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

        # Dicionário para mapear tipo de usuário para dados e nome do perfil
        profile_map = {
            Usuario.TipoUsuario.PRODUTOR: (produtor_data, 'perfil_produtor'),
            Usuario.TipoUsuario.COLETOR: (coletor_data, 'perfil_coletor'),
            Usuario.TipoUsuario.RECEPTOR: (receptor_data, 'perfil_receptor'),
        }

        # Obtém os dados e o nome do atributo do perfil para o tipo de usuário da instância
        profile_data, profile_name = profile_map.get(instance.tipo_usuario, (None, None))

        # Se dados do perfil foram enviados e o usuário tem o perfil correspondente, atualiza-o
        if profile_data and profile_name and hasattr(instance, profile_name):
            profile = getattr(instance, profile_name)
            # Itera sobre os dados do perfil e atualiza os campos
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()

        return instance

class UsuarioReadOnlySerializer(UsuarioSerializer):
    perfil_produtor = ProdutorSerializer(read_only=True)
    perfil_coletor = ColetorSerializer(read_only=True)
    perfil_receptor = ReceptorSerializer(read_only=True)