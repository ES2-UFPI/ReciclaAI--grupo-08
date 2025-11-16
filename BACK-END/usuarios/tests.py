from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Usuario, Coletor
from validate_docbr import CPF, CNPJ

class UsuarioAPITests(APITestCase):
 
    def setUp(self):
        self.list_create_url = reverse('usuario-list')
        cpf_generator = CPF()
        
        self.user = Usuario.objects.create_user(
            username="usertest",
            password="password123",
            first_name="User",
            last_name="Test",
            tipo_usuario="PRODUTOR",
            cpf=cpf_generator.generate(),
            telefone="(11) 99999-9999",
            endereco_completo="Rua dos Produtores, 1"
        )
        self.detail_url = reverse('usuario-detail', kwargs={'pk': self.user.pk})

    def test_listar_usuarios(self):
        response = self.client.get(self.list_create_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['username'], self.user.username)

    def test_recuperar_detalhe_usuario(self):
        response = self.client.get(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)

    def test_criar_usuario_produtor(self):
        data = {
            "username": "produtortest",
            "password": "password123",
            "first_name": "Novo",
            "last_name": "Produtor",
            "email": "produtor@test.com",
            "tipo_usuario": "PRODUTOR",
            "cpf": CPF().generate(),
            "telefone": "(11) 90000-0000",
            "endereco_completo": "Rua dos Produtores, 2",
            "perfil_produtor": {}
        }
        response = self.client.post(self.list_create_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Usuario.objects.count(), 2)
        self.assertTrue(Usuario.objects.filter(username="produtortest").exists())

    def test_criar_usuario_coletor_com_perfil(self):
        data = {
            "username": "coletortest",
            "password": "password123",
            "first_name": "Novo",
            "last_name": "Coletor",
            "email": "coletor@test.com",
            "tipo_usuario": "COLETOR",
            "cpf": CPF().generate(),
            "telefone": "(11) 95555-1234",
            "endereco_completo": "Rua dos Coletores, 1",
            "perfil_coletor": {
                "tipo_veiculo": "Caminhão",
                "capacidade_carga": "1000.00"
            }
        }
        response = self.client.post(self.list_create_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Usuario.objects.count(), 2)
        self.assertEqual(Coletor.objects.count(), 1)
        
        new_user = Usuario.objects.get(username="coletortest")
        self.assertTrue(hasattr(new_user, 'perfil_coletor'))
        self.assertEqual(new_user.perfil_coletor.tipo_veiculo, "Caminhão")

    def test_criar_usuario_com_cpf_invalido(self):
        data = {
            "username": "cpfinvalido",
            "password": "password123",
            "first_name": "Test",
            "last_name": "CPF",
            "email": "cpf@test.com",
            "tipo_usuario": "PRODUTOR",
            "cpf": "12345678900",
            "telefone": "(11) 95555-9999",
            "endereco_completo": "Rua Inválida, 0"
        }
        response = self.client.post(self.list_create_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('cpf', response.data)

    def test_atualizar_usuario(self):
        update_data = {
            "first_name": "UpdatedFirstName",
            "endereco_completo": "Nova Rua, 456"
        }
        response = self.client.patch(self.detail_url, update_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "UpdatedFirstName")
        self.assertEqual(self.user.endereco_completo, "Nova Rua, 456")

    def test_deletar_usuario(self):
        response = self.client.delete(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Usuario.objects.count(), 0)
