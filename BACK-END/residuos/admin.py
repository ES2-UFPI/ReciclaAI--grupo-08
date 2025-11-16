from django.contrib import admin
from .models import Residuo

@admin.register(Residuo)
class ResiduoAdmin(admin.ModelAdmin):
    list_display = ('tipo', 'valor', 'descricao', 'data_criacao')
    list_filter = ('tipo', 'data_criacao')
    search_fields = ('tipo',)
    date_hierarchy = 'data_criacao'
    ordering = ('-data_criacao', 'valor',)
