from decimal import Decimal

from django.conf import settings
from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator
from residuos.models import Residuo


class Carga(models.Model):
    STATUS_CRIADA = "criada"
    STATUS_AGUARDANDO_COLETA = "aguardando_coleta"
    STATUS_EM_COLETA = "em_coleta"
    STATUS_A_CAMINHO = "a_caminho"
    STATUS_ENTREGUE = "entregue"
    STATUS_CANCELADA = "cancelada"

    STATUS_CHOICES = [
        (STATUS_CRIADA, "Criada"),
        (STATUS_AGUARDANDO_COLETA, "Aguardando coleta"),
        (STATUS_EM_COLETA, "Em coleta"),
        (STATUS_A_CAMINHO, "A caminho do receptor"),
        (STATUS_ENTREGUE, "Entregue"),
        (STATUS_CANCELADA, "Cancelada"),
    ]

    produtor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cargas_produtor",
    )

    valor_total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[MinValueValidator(Decimal("0"))],
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default=STATUS_CRIADA,
    )

    criado_em = models.DateTimeField(default=timezone.now)
    entregue_em = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Carga #{self.id} - Produtor: {self.produtor}"

    @property
    def peso_total_kg(self):
        """Soma o peso de todos os resíduos desta carga."""
        return (
            self.itens.aggregate(models.Sum("peso_kg"))["peso_kg__sum"]
            or Decimal("0")
        )

    def recalcular_valor_total(self, salvar=True):
        """Recalcula valor_total somando o valor de todos os itens."""
        total = (
            self.itens.aggregate(models.Sum("valor"))["valor__sum"]
            or Decimal("0.00")
        )
        self.valor_total = total
        if salvar:
            self.save(update_fields=["valor_total"])
        return total


class CargaResiduo(models.Model):
    carga = models.ForeignKey(
        Carga,
        on_delete=models.CASCADE,
        related_name="itens",
    )
    residuo = models.ForeignKey(
        Residuo,
        on_delete=models.PROTECT,
        related_name="cargas_residuo",
    )

    # quanto desse resíduo está nessa carga
    peso_kg = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
    )

    # valor total dessa linha (peso_kg * residuo.valor_kg)
    valor = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0"))],
    )

    def __str__(self):
        return f"CargaResiduo #{self.id} da Carga #{self.carga_id}"

    def calcular_valor(self, salvar=True):
        """Define valor = peso_kg * residuo.valor_kg."""
        self.valor = (self.peso_kg or Decimal("0")) * self.residuo.valor
        if salvar:
            self.save()
        return self.valor
