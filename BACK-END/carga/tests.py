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
        # Residuo conforme seu modelo: tipo (choices) + valor (DecimalField)
        self.residuo = Residuo.objects.create(
            tipo="PLASTICO",          # um dos choices: PLASTICO, PAPEL, VIDRO, METAL
            valor=Decimal("2.50"),
        )
        self.carga = Carga.objects.create(produtor=self.produtor)

    def test_valor_total_inicia_em_zero(self):
        self.assertEqual(self.carga.valor_total, Decimal("0.00"))

    def test_criar_carga_residuo(self):
        carga_residuo = CargaResiduo.objects.create(
            carga=self.carga,
            residuo=self.residuo,
            peso_kg=Decimal("10.00"),
            valor=Decimal("25.00"),
        )
        self.assertEqual(carga_residuo.valor, Decimal("25.00"))
        self.assertEqual(carga_residuo.peso_kg, Decimal("10.00"))
        self.assertEqual(carga_residuo.residuo, self.residuo)
        self.assertEqual(carga_residuo.carga, self.carga)

    def test_recalcular_valor_total(self):
        CargaResiduo.objects.create(
            carga=self.carga,
            residuo=self.residuo,
            peso_kg=Decimal("4.00"),
            valor=Decimal("10.00"),
        )
        CargaResiduo.objects.create(
            carga=self.carga,
            residuo=self.residuo,
            peso_kg=Decimal("2.00"),
            valor=Decimal("5.00"),
        )
        self.carga.recalcular_valor_total()
        self.assertEqual(self.carga.valor_total, Decimal("15.00"))

    def test_peso_total_kg_property(self):
        CargaResiduo.objects.create(
            carga=self.carga,
            residuo=self.residuo,
            peso_kg=Decimal("3.00"),
            valor=Decimal("7.50"),
        )
        CargaResiduo.objects.create(
            carga=self.carga,
            residuo=self.residuo,
            peso_kg=Decimal("2.00"),
            valor=Decimal("5.00"),
        )
        total_peso = self.carga.peso_total_kg
        self.assertEqual(total_peso, Decimal("5.00"))

    def test_calcular_valor_do_item(self):
        carga_residuo = CargaResiduo.objects.create(
            carga=self.carga,
            residuo=self.residuo,
            peso_kg=Decimal("4.00"),
            valor=Decimal("0.00"),
        )
        valor_calculado = carga_residuo.calcular_valor(salvar=True)
        self.assertEqual(valor_calculado, Decimal("10.00"))
        self.assertEqual(carga_residuo.valor, Decimal("10.00"))

    def test_str_carga(self):
        s = str(self.carga)
        self.assertIn("Carga #", s)
        self.assertIn("Produtor", s)

    def test_str_carga_residuo(self):
        carga_residuo = CargaResiduo.objects.create(
            carga=self.carga,
            residuo=self.residuo,
            peso_kg=Decimal("1.00"),
            valor=Decimal("2.50"),
        )
        s = str(carga_residuo)
        self.assertIn(f"Carga #{self.carga.id}", s)
