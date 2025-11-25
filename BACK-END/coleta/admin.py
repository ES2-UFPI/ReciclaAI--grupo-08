from django.contrib import admin
from .models import Coleta

@admin.register(Coleta)
class ColetaAdmin(admin.ModelAdmin):
    list_display = ("id", "coletor", "carga", "data_coleta")
    list_filter = ("coletor", "carga")
    search_fields = ("id", "coletor__username", "carga__id")
