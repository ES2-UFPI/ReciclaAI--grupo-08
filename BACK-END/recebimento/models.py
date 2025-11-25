from django.db import models
from django.conf import settings
from carga.models import Carga

class Recebimento(models.Model):
    """
    Registra o momento em que uma Carga é efetivamente recebida
    por um Receptor, permitindo a checagem do peso.
    """
    # Relação com a Carga que está sendo recebida.
    # OneToOneField garante que cada carga só pode ser recebida uma vez.
    carga = models.OneToOneField(Carga, on_delete=models.PROTECT, related_name='recebimento')

    # Relação com o usuário Receptor que está confirmando o recebimento.
    receptor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        limit_choices_to={'tipo_usuario': 'RECEPTOR'}
    )
    # Campo para a data e hora em que o recebimento foi registrado.
    data_recebimento = models.DateTimeField(auto_now_add=True)
    # Campo para o peso conferido no momento do recebimento, para checagem.
    peso_conferido_kg = models.DecimalField(max_digits=10, decimal_places=2, help_text="Peso em Kg conferido no momento do recebimento para checagem.")

    def __str__(self):
        return f"Recebimento da Carga #{self.carga.id} por {self.receptor.username}"

