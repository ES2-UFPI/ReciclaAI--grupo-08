from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Recebimento
from usuarios.models import Usuario
from carga.models import Carga
from validate_docbr import CPF, CNPJ
from decimal import Decimal

class RecebimentoAPITests(APITestCase):

    def setUp(self):
        self.recebimentos_url = reverse('recebimento-list')
        cpf_generator = CPF()

        # Cria um usuário Produtor
        self.produtor = Usuario.objects.create_user(
            username="produtor_teste", password="123", tipo_usuario="PRODUTOR",
            cpf=cpf_generator.generate(), first_name="Produtor", last_name="Teste"
        )

        # Cria um usuário Receptor
        self.receptor = Usuario.objects.create_user(
            username="receptor_teste", password="123", tipo_usuario="RECEPTOR",
            cpf=cpf_generator.generate(), first_name="Receptor", last_name="Teste"
        )

        # Cria uma Carga para ser recebida
        self.carga = Carga.objects.create(produtor=self.produtor, valor_total=Decimal("100.00"))

    def test_criar_recebimento_com_sucesso(self):
        """
        Garante que um recebimento pode ser criado com dados válidos.
        """
        data = {
            "carga": self.carga.id,
            "receptor": self.receptor.id,
            "peso_conferido_kg": "150.50"
        }
        response = self.client.post(self.recebimentos_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Recebimento.objects.count(), 1)
        
        recebimento = Recebimento.objects.first()
        self.assertEqual(recebimento.carga, self.carga)
        self.assertEqual(recebimento.receptor, self.receptor)
        self.assertEqual(recebimento.peso_conferido_kg, Decimal("150.50"))

    def test_nao_pode_criar_recebimento_para_carga_ja_recebida(self):
        """
        Verifica a validação que impede o recebimento duplicado de uma mesma carga.
        """
        # Cria o primeiro recebimento
        Recebimento.objects.create(
            carga=self.carga, receptor=self.receptor, peso_conferido_kg=Decimal("150.00")
        )

        # Tenta criar o segundo recebimento para a mesma carga
        data = {
            "carga": self.carga.id,
            "receptor": self.receptor.id,
            "peso_conferido_kg": "149.00"
        }
        response = self.client.post(self.recebimentos_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Esta carga já possui um registro de recebimento.", response.data['carga'])

    def test_nao_pode_criar_recebimento_com_usuario_nao_receptor(self):
        """
        Verifica a validação que impede que um não-receptor confirme um recebimento.
        """
        data = {
            "carga": self.carga.id,
            "receptor": self.produtor.id,  # Usando o ID de um Produtor
            "peso_conferido_kg": "150.00"
        }
        response = self.client.post(self.recebimentos_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("O usuário informado não é do tipo RECEPTOR.", response.data['receptor'])

    def test_listar_e_filtrar_recebimentos(self):
        """
        Testa a listagem e a filtragem de recebimentos.
        """
        # Cria um segundo conjunto de dados para testar o filtro
        outra_carga = Carga.objects.create(produtor=self.produtor, valor_total=Decimal("50.00"))
        Recebimento.objects.create(
            carga=self.carga, receptor=self.receptor, peso_conferido_kg=Decimal("150.00")
        )
        Recebimento.objects.create(
            carga=outra_carga, receptor=self.receptor, peso_conferido_kg=Decimal("50.00")
        )

        # Testa a listagem geral
        response = self.client.get(self.recebimentos_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

        # Testa o filtro por carga
        response_filtrada = self.client.get(f"{self.recebimentos_url}?carga={self.carga.id}")
        self.assertEqual(response_filtrada.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_filtrada.data['results']), 1)
        self.assertEqual(response_filtrada.data['results'][0]['carga'], self.carga.id)