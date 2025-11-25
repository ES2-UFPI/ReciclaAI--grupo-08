from django.test import TestCase
from django.contrib.auth import get_user_model
from residuos.models import Residuo
from .models import Carga, CargaResiduo
from decimal import Decimal

User = get_user_model()


class CargaModelTest(TestCase):
    def setUp(self):
        self.produtor = User.objects.create_user(
            username="produtor1",
            email="produtor1@example.com",
            password="123456",
        )
        self.residuo1 = Residuo.objects.create(
            tipo="PLASTICO", valor=Decimal("2.50"),
        )
        self.residuo2 = Residuo.objects.create(
            tipo="VIDRO", valor=Decimal("1.00"),
        )
        self.carga = Carga.objects.create(produtor=self.produtor)

    def test_valor_total_inicia_em_zero(self):
        self.assertEqual(self.carga.valor_total, Decimal("0.00"))

    def test_adicionar_residuo_atualiza_valor_total(self):
        item1 = self.carga.adicionar_residuo(self.residuo1, Decimal("4.00"))
        item2 = self.carga.adicionar_residuo(self.residuo2, Decimal("3.00"))
        self.assertEqual(item1.valor, Decimal("10.00"))
        self.assertEqual(item2.valor, Decimal("3.00"))
        self.carga.refresh_from_db()
        self.assertEqual(self.carga.valor_total, Decimal("13.00"))

    def test_peso_total_kg_property(self):
        self.carga.adicionar_residuo(self.residuo1, Decimal("2.00"))
        self.carga.adicionar_residuo(self.residuo2, Decimal("5.00"))
        self.assertEqual(self.carga.peso_total_kg, Decimal("7.00"))

    def test_remover_item_atualiza_valor_total(self):
        item1 = self.carga.adicionar_residuo(self.residuo1, Decimal("2.00"))
        item2 = self.carga.adicionar_residuo(self.residuo2, Decimal("5.00"))
        self.carga.remover_item(item1.id)
        self.carga.refresh_from_db()
        self.assertEqual(self.carga.valor_total, Decimal("5.00"))

    def test_limpar_itens_zerar_valor_total(self):
        self.carga.adicionar_residuo(self.residuo1, Decimal("2.00"))
        self.carga.adicionar_residuo(self.residuo2, Decimal("5.00"))
        self.carga.limpar_itens()
        self.carga.refresh_from_db()
        self.assertEqual(self.carga.valor_total, Decimal("0.00"))
        self.assertEqual(self.carga.itens.count(), 0)

    def test_str_carga(self):
        self.assertIn(f"Carga #{self.carga.id}", str(self.carga))

    def test_str_carga_residuo(self):
        item = self.carga.adicionar_residuo(self.residuo1, Decimal("1.00"))
        self.assertIn(f"CargaResiduo #{item.id}", str(item))
