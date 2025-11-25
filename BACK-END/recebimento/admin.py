from django.contrib import admin
from .models import Recebimento

@admin.register(Recebimento)
class RecebimentoAdmin(admin.ModelAdmin):
    list_display = ('id', 'carga', 'receptor', 'data_recebimento', 'peso_conferido_kg')
    list_filter = ('receptor', 'data_recebimento')
    search_fields = ('carga__id', 'receptor__username')
    readonly_fields = ('data_recebimento',)
