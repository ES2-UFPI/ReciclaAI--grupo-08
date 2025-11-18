from django.contrib import admin
from .models import Carga

@admin.register(Carga)
class CargaAdmin(admin.ModelAdmin):
    list_display = ('id', 'produtor', 'status', 'valor_total', 'criado_em', 'entregue_em')
    list_filter = ('status', 'criado_em', 'produtor')
    search_fields = ('produtor__username', 'id')
    date_hierarchy = 'criado_em'
    ordering = ('-criado_em',)
    readonly_fields = ('valor_total',)
