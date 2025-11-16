from django.db import models
from django.conf import settings

class Residuo(models.Model):

    TIPO_RESIDUO_CHOICES = [
        ('PLASTICO', 'Plástico'), 
        ('PAPEL', 'Papel'),       
        ('VIDRO', 'Vidro'),       
        ('METAL', 'Metal'),
    ]

    tipo = models.CharField(
        max_length=20,
        choices=TIPO_RESIDUO_CHOICES,
        verbose_name="Tipo de Resíduo"
    )
    valor = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Valor (R$)",
        help_text="Valor monetário do resíduo, se aplicável."
    )

    descricao = models.TextField(blank=True, null=True, verbose_name="Descrição")
    data_criacao = models.DateTimeField(auto_now_add=True, verbose_name="Data de Registro")


    def __str__(self):
        return f"{self.get_tipo_display()}"

    class Meta:
        ordering = ['-data_criacao']
