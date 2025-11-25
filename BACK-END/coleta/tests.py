from django.test import TestCase
from django.contrib.auth import get_user_model
from carga.models import Carga
from .models import Coleta
from decimal import Decimal
from datetime import datetime
from residuos.models import Residuo

User = get_user_model()

class ColetaModelTest(TestCase):
    def setUp(self):
        self.coletor = User.objects.create_user(
            username="coletor1",
            password="123456",
            cpf="11111111111"
        )

        self.produtor = User.objects.create_user(
            username="produtor1",
            password="123456",
            cpf="22222222222"
        )

        self.residuo = Residuo.objects.create(
            tipo="PLASTICO",
            valor=Decimal("2.50")
        )

        self.carga = Carga.objects.create(produtor=self.produtor)
        self.carga.adicionar_residuo(self.residuo, Decimal("10.00"))

        self.data_coleta = datetime(2025, 11, 25, 10, 0)

    def test_criar_coleta(self):
        coleta = Coleta.objects.create(
            coletor=self.coletor,
            carga=self.carga,
            data_coleta=self.data_coleta
        )

        self.assertEqual(coleta.coletor, self.coletor)
        self.assertEqual(coleta.carga, self.carga)
        self.assertEqual(coleta.data_coleta, self.data_coleta)

    def test_str_coleta(self):
        coleta = Coleta.objects.create(
            coletor=self.coletor,
            carga=self.carga,
            data_coleta=self.data_coleta
        )

        self.assertIn(f"Coleta #{coleta.id}", str(coleta))
        self.assertIn(str(self.coletor), str(coleta))
        self.assertIn(str(self.carga), str(coleta))
