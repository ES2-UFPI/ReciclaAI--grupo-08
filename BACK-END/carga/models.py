from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
# Supondo que o modelo Residuo está em 'residuos.models'
from residuos.models import Residuo

class Carga(models.Model):
    class StatusCarga(models.TextChoices):
        PENDENTE = 'PENDENTE', 'Pendente'
        EM_COLETA = 'EM_COLETA', 'Em Coleta'
        ENTREGUE = 'ENTREGUE', 'Entregue'
        CANCELADA = 'CANCELADA', 'Cancelada'

    produtor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT, # Evita que um usuário seja deletado se tiver cargas
        related_name='cargas',
        verbose_name="Produtor"
    )

    # Valor monetário total, acumulado a partir dos itens
    valor_total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0)],
        verbose_name="Valor Total (R$)",
        help_text="Valor total acumulado dos resíduos na carga."
    )

    status = models.CharField(
        max_length=20,
        choices=StatusCarga.choices,
        default=StatusCarga.PENDENTE,
        verbose_name="Status"
    )

    # Data de criação (quando o primeiro resíduo é incluído)
    criado_em = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Criado em"
    )

    # Data de entrega (atualizada quando o status muda para 'ENTREGUE')
    entregue_em = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Entregue em"
    )

    def __str__(self):
        return f"Carga #{self.id} - {self.produtor.username} ({self.status})"

    class Meta:
        ordering = ['-criado_em']
        verbose_name = "Carga"
        verbose_name_plural = "Cargas"


class ItemCarga(models.Model):
    """
    Item individual dentro de uma Carga, representando um tipo
    de resíduo e sua quantidade.
    """
    carga = models.ForeignKey(
        Carga,
        on_delete=models.CASCADE,
        related_name='itens',
        verbose_name="Carga"
    )
    residuo = models.ForeignKey(
        Residuo,
        on_delete=models.PROTECT,
        verbose_name="Resíduo"
    )
    quantidade_kg = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        verbose_name="Quantidade (kg)"
    )

    def __str__(self):
        return f"{self.quantidade_kg}kg de {self.residuo.tipo} na Carga #{self.carga.id}"

    class Meta:
        verbose_name = "Item da Carga"
        verbose_name_plural = "Itens da Carga"
        ordering = ['-id']
