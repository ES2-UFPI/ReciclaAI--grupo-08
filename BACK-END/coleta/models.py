from django.db import models
from django.conf import settings
from carga.models import Carga

class Coleta(models.Model):
    coletor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="coletas_realizadas"
    )
    carga = models.ForeignKey(
        Carga,
        on_delete=models.CASCADE,
        related_name="coletas"
    )
    data_coleta = models.DateTimeField()

    def __str__(self):
        return f"Coleta #{self.id} - Coletor: {self.coletor} - Carga: {self.carga}"
