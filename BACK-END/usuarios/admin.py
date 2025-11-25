from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Usuario, Coletor, Receptor, Produtor, ResiduoAceito


class ResiduoAceitoInline(admin.TabularInline):
    model = ResiduoAceito
    extra = 1 # Mostra 1 campo extra para adicionar

@admin.register(Usuario)
class UsuarioAdmin(BaseUserAdmin):
   
    list_display = ('username', 'email', 'first_name', 'last_name', 'tipo_usuario', 'is_staff')

 
    list_filter = ('tipo_usuario', 'is_staff', 'is_superuser', 'groups')

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Informações Pessoais', {'fields': ('first_name', 'last_name', 'email', 'tipo_usuario', 'cpf', 'data_nascimento', 'telefone')}),
        ('Endereço', {'fields': ('endereco_completo',)}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Datas Importantes', {'fields': ('last_login', 'date_joined')}),
    )


@admin.register(Receptor)
class ReceptorAdmin(admin.ModelAdmin):
    list_display = ('nome_empresa', 'usuario', 'cnpj')
    inlines = [ResiduoAceitoInline]


admin.site.register(Produtor)
admin.site.register(Coletor)