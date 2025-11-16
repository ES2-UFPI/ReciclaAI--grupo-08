from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from .validators import validate_cpf, validate_cnpj

class Usuario(AbstractUser):

    class TipoUsuario(models.TextChoices):
        PRODUTOR = 'PRODUTOR', 'Produtor'
        COLETOR = 'COLETOR', 'Coletor'
        RECEPTOR = 'RECEPTOR', 'Receptor'

    tipo_usuario = models.CharField(max_length=10, choices=TipoUsuario.choices, verbose_name='Tipo de Usuário')


    first_name = models.CharField("Nome", max_length=150, blank=False)
    last_name = models.CharField("Sobrenome", max_length=150, blank=False)


    cpf = models.CharField(max_length=14, unique=True, help_text="Pode ser informado com ou sem pontuação.", validators=[validate_cpf])
    data_nascimento = models.DateField(verbose_name="Data de Nascimento", null=True, blank=True)
    telefone = models.CharField(max_length=15, help_text="Formato: (00) 00000-0000")


    endereco_completo = models.CharField("Endereço Completo", max_length=255)

    def __str__(self):
        return self.get_full_name() or self.username

    class Meta:
        ordering = ['id']


class Produtor(models.Model):

    usuario = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True, related_name='perfil_produtor')


    def __str__(self):
        return self.usuario.get_full_name()

    class Meta:
        ordering = ['usuario__username']


class Coletor(models.Model):

    usuario = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True, related_name='perfil_coletor')
    tipo_veiculo = models.CharField(max_length=50, verbose_name="Tipo de Veículo")
    capacidade_carga = models.DecimalField(max_digits=10, decimal_places=2, help_text="Capacidade em kg")

    def __str__(self):
        return self.usuario.get_full_name()

    class Meta:
        ordering = ['usuario__username']


class Receptor(models.Model):

    usuario = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True, related_name='perfil_receptor')
    nome_empresa = models.CharField(max_length=255, verbose_name="Nome da Empresa")
    cnpj = models.CharField(max_length=18, unique=True, help_text="Pode ser informado com ou sem pontuação.", validators=[validate_cnpj])
    endereco_comercial = models.CharField(max_length=255, verbose_name="Endereço Comercial")
    horario_funcionamento = models.CharField(max_length=100, verbose_name="Horário de Funcionamento")
    tipos_de_residuo_aceitos = models.CharField(max_length=255, help_text="Ex: Plástico, Vidro, Metal")

    def __str__(self):
        return self.nome_empresa

    class Meta:
        ordering = ['nome_empresa']