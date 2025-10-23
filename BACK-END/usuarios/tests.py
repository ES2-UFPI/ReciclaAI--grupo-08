from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Usuario, Coletor

class UsuarioAPITests(APITestCase):
    """
    Test suite for the Usuario API.
    """

    def setUp(self):
        """
        Set up initial data for tests.
        """
        self.list_create_url = reverse('usuario-list-create')

        # Data for creating a 'COLETOR' user
        self.coletor_data = {
            "username": "coletortest",
            "password": "strongpassword123",
            "first_name": "Test",
            "last_name": "Coletor",
            "email": "coletor@test.com",
            "tipo_usuario": "COLETOR",
            "cpf": "111.222.333-44",
            "telefone": "(11) 98765-4321",
            "endereco_completo": "Rua dos Testes, 123",
            "perfil_coletor": {
                "tipo_veiculo": "Bicicleta",
                "capacidade_carga": "50.00"
            }
        }

        # Create a user for detail/update/delete tests
        self.user = Usuario.objects.create_user(
            username="usertest",
            password="password123",
            first_name="User",
            last_name="Test",
            tipo_usuario="PRODUTOR",
            cpf="999.888.777-66"
        )
        self.detail_url = reverse('usuario-detail', kwargs={'pk': self.user.pk})

    def test_create_coletor_user_with_profile(self):
        """
        Ensure we can create a new user with a 'COLETOR' profile.
        """
        response = self.client.post(self.list_create_url, self.coletor_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Usuario.objects.count(), 2) # setUp user + new user
        self.assertEqual(Coletor.objects.count(), 1)

        new_user = Usuario.objects.get(username="coletortest")
        self.assertTrue(hasattr(new_user, 'perfil_coletor'))
        self.assertEqual(new_user.perfil_coletor.tipo_veiculo, "Bicicleta")

    def test_list_users(self):
        """
        Ensure we can list users.
        """
        response = self.client.get(self.list_create_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['username'], self.user.username)

    def test_retrieve_user_detail(self):
        """
        Ensure we can retrieve a single user's details.
        """
        response = self.client.get(self.detail_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)

    def test_update_user(self):
        """
        Ensure we can update a user's information.
        """
        # Note: For a real app, you'd need authentication to perform this
        # self.client.force_authenticate(user=self.user)

        update_data = {
            "first_name": "UpdatedFirstName",
            "endereco_completo": "Nova Rua, 456"
        }
        response = self.client.patch(self.detail_url, update_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "UpdatedFirstName")
        self.assertEqual(self.user.endereco_completo, "Nova Rua, 456")

    def test_delete_user(self):
        """
        Ensure we can delete a user.
        """
        # Note: For a real app, you'd need authentication to perform this
        # self.client.force_authenticate(user=self.user)

        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Usuario.objects.count(), 0)