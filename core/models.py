# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Avaliacao(models.Model):
    avaliador = models.ForeignKey('Usuario', models.DO_NOTHING, blank=True, null=True)
    avaliado = models.ForeignKey('Usuario', models.DO_NOTHING, related_name='avaliacao_avaliado_set', blank=True, null=True)
    carga = models.ForeignKey('Carga', models.DO_NOTHING, blank=True, null=True)
    nota = models.IntegerField(blank=True, null=True)
    comentario = models.TextField(blank=True, null=True)
    criado_em = models.DateTimeField(blank=True, null=True)

    class Meta:
        #managed = False
        db_table = 'avaliacao'


class Carga(models.Model):
    produtor = models.ForeignKey('Usuario', models.DO_NOTHING, blank=True, null=True)
    valor_total = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True) # PENDENTE, AGENDADA, EM_TRANSITO e FINALIZADA
    criado_em = models.DateTimeField(blank=True, null=True)
    entregue_em = models.DateTimeField(blank=True, null=True)

    class Meta:
        #managed = False
        db_table = 'carga'


class CargaResiduo(models.Model):
    carga = models.ForeignKey(Carga, models.DO_NOTHING, blank=True, null=True)
    residuo = models.ForeignKey('Residuo', models.DO_NOTHING, blank=True, null=True)
    peso_kg = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    valor = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        #managed = False
        db_table = 'carga_residuo'


class Coleta(models.Model):
    coletor = models.ForeignKey('Usuario', models.DO_NOTHING, blank=True, null=True)
    carga = models.ForeignKey(Carga, models.DO_NOTHING, blank=True, null=True)
    data_coleta = models.DateTimeField(blank=True, null=True)
    status = models.TextField(blank=True, null=True)

    class Meta:
       # managed = False
        db_table = 'coleta'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Pontos(models.Model):
    usuario = models.ForeignKey('Usuario', models.DO_NOTHING, blank=True, null=True)
    carga = models.ForeignKey(Carga, models.DO_NOTHING, blank=True, null=True)
    data = models.DateTimeField(blank=True, null=True)
    pontos = models.IntegerField(blank=True, null=True)
    motivo = models.TextField(blank=True, null=True)

    class Meta:
        #managed = False
        db_table = 'pontos'


class Recebimento(models.Model):
    receptor = models.ForeignKey('Usuario', models.DO_NOTHING, blank=True, null=True)
    carga = models.ForeignKey(Carga, models.DO_NOTHING, blank=True, null=True)
    peso_confirmado = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    data_recebido = models.DateTimeField(blank=True, null=True)
    pontos = models.IntegerField(blank=True, null=True)

    class Meta:
        #managed = False
        db_table = 'recebimento'


class Residuo(models.Model):
    tipo = models.CharField(max_length=100)
    valor_kg = models.DecimalField(max_digits=10, decimal_places=2)
    descricao = models.TextField(blank=True, null=True)

    class Meta:
       # managed = False
        db_table = 'residuo'


class Usuario(models.Model):
    nome = models.CharField(max_length=255)
    email = models.CharField(unique=True, max_length=255)
    senha = models.CharField(max_length=255)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    endereco = models.TextField(blank=True, null=True)
    criado_em = models.DateTimeField(blank=True, null=True)
    tipo_usuario = models.CharField(max_length=50)
    cpf = models.CharField(max_length=14, blank=True, null=True)
    cnpj = models.CharField(max_length=18, blank=True, null=True)
    tipo_pessoa = models.CharField(max_length=1, blank=True, null=True)
    quantidade_minima_kg = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    horario = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    avaliacao_media = models.DecimalField(max_digits=3, decimal_places=2)

    class Meta:
        #managed = False
        db_table = 'usuario'


class UsuarioResiduo(models.Model):
    
    usuario = models.ForeignKey(Usuario, models.DO_NOTHING)
    #usuario = models.ForeignKey(Usuario, models.DO_NOTHING, primary_key=True)
    residuos = models.ForeignKey(Residuo, models.DO_NOTHING)
    residuos = models.ForeignKey(Residuo, models.DO_NOTHING, null=True, blank=True)

    class Meta:
        #managed = False
        db_table = 'usuario_residuo'
        unique_together = (('usuario', 'residuos'),)
