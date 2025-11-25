from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Residuo

class ResiduoAPITests(APITestCase):
    def setUp(self):
        self.list_url = reverse('residuo-list')
        self.residuo1 = Residuo.objects.create(tipo='PLASTICO', valor=15.50, descricao="Garrafas PET")
        self.residuo2 = Residuo.objects.create(tipo='VIDRO', valor=5.00, descricao="Garrafas de cerveja")
        self.detail_url = reverse('residuo-detail', kwargs={'pk': self.residuo1.pk})

    def test_listar_residuos(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_criar_residuo_valido(self):
        data = {
            'tipo': 'METAL',
            'valor': '25.00',
            'descricao': 'Latas de alumínio'
        }
        response = self.client.post(self.list_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Residuo.objects.count(), 3)
        self.assertEqual(Residuo.objects.latest('id').tipo, 'METAL')

    def test_criar_residuo_com_valor_negativo(self):
        data = {
            'tipo': 'PAPEL',
            'valor': '-10.00',
            'descricao': 'Papelão'
        }
        response = self.client.post(self.list_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('valor', response.data)

    def test_recuperar_detalhe_residuo(self):
        response = self.client.get(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['tipo'], self.residuo1.tipo)

    def test_atualizar_residuo(self):
        update_data = {'valor': '18.75'}
        response = self.client.patch(self.detail_url, update_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.residuo1.refresh_from_db()
        self.assertEqual(self.residuo1.valor, 18.75)

    def test_deletar_residuo(self):
        response = self.client.delete(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Residuo.objects.count(), 1)
        self.assertFalse(Residuo.objects.filter(pk=self.residuo1.pk).exists())
