# cargas/admin.py
from django.contrib import admin
from .models import Carga, CargaResiduo


class CargaResiduoInline(admin.TabularInline):
    model = CargaResiduo
    extra = 1


@admin.register(Carga)
class CargaAdmin(admin.ModelAdmin):
    list_display = ("id", "produtor", "valor_total", "status", "criado_em", "entregue_em")
    list_filter = ("status", "criado_em")
    search_fields = ("id", "produtor__email", "produtor__username")
    inlines = [CargaResiduoInline]


@admin.register(CargaResiduo)
class CargaResiduoAdmin(admin.ModelAdmin):
    list_display = ("id", "carga", "residuo", "peso_kg", "valor")
    list_filter = ("residuo",)
    search_fields = ("carga__id", "residuo__tipo")
