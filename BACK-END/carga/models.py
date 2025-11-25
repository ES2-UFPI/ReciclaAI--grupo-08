from decimal import Decimal
from django.db import models
from django.conf import settings
from residuos.models import Residuo


class Carga(models.Model):
    """
    Carga funciona como o 'composto' do padrão Composite:
    ela agrega vários CargaResiduo (partes), que referenciam
    resíduos individuais, e expõe operações sobre o conjunto
    (peso_total_kg, valor_total, adicionar/remover itens).
    """

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
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default=STATUS_CRIADA,
    )

    criado_em = models.DateTimeField(auto_now_add=True)
    entregue_em = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Carga #{self.id} - Produtor: {self.produtor}"

    # ---------- Operações de agregação (Composite) ----------

    @property
    def peso_total_kg(self):
        """
        Soma o peso de todos os resíduos desta carga.
        Parte do comportamento composto do padrão Composite.
        """
        return (
            self.itens.aggregate(models.Sum("peso_kg"))["peso_kg__sum"]
            or Decimal("0")
        )

    def recalcular_valor_total(self, salvar=True):
        """
        Recalcula valor_total somando o valor de todos os itens.
        """
        total = (
            self.itens.aggregate(models.Sum("valor"))["valor__sum"]
            or Decimal("0.00")
        )
        self.valor_total = total
        if salvar:
            self.save()
        return total

    # ---------- Métodos de composição explícitos ----------

    def adicionar_residuo(self, residuo: Residuo, peso_kg: Decimal, salvar=True):
        """
        Adiciona um resíduo à carga, criando um CargaResiduo.
        Este método deixa explícito que Carga controla sua composição,
        reforçando o padrão Composite.
        """
        valor = peso_kg * residuo.valor
        item = CargaResiduo.objects.create(
            carga=self,
            residuo=residuo,
            peso_kg=peso_kg,
            valor=valor,
        )
        # atualiza o valor_total da carga
        self.recalcular_valor_total(salvar=salvar)
        return item

    def remover_item(self, item_id: int, salvar=True):
        """
        Remove um item (CargaResiduo) da carga e atualiza o valor_total.
        """
        self.itens.filter(id=item_id).delete()
        self.recalcular_valor_total(salvar=salvar)

    def limpar_itens(self, salvar=True):
        """
        Remove todos os itens da carga e zera o valor_total.
        Útil para reconfigurar completamente a composição da carga.
        """
        self.itens.all().delete()
        self.valor_total = Decimal("0.00")
        if salvar:
            self.save()

class CargaResiduo(models.Model):
    """
    CargaResiduo representa uma 'parte' da Carga dentro do Composite:
    liga uma carga a um resíduo específico, com um determinado peso
    e valor calculado.
    """

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
    )

    # valor total dessa linha (peso_kg * residuo.valor)
    valor = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    def __str__(self):
        return f"CargaResiduo #{self.id} da Carga #{self.carga_id}"

    def calcular_valor(self, salvar=True):
        """
        Define valor = peso_kg * residuo.valor.
        Parte do padrão Composite: a carga agrega o valor de todos os itens.
        """
        self.valor = (self.peso_kg or Decimal("0")) * self.residuo.valor
        if salvar:
            self.save(update_fields=["valor"])
        return self.valor
