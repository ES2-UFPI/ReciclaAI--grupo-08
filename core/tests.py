from django.test import TestCase
from rest_framework.test import APIClient
from core.models import Usuario


class UsuarioTests(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_criar_usuario(self):
        payload = {
    "nome": "Lucas Teste",
    "email": "lucas@example.com",
    "senha": "1234",
    "tipo_usuario": "produtor",
    "latitude": -23.55,
    "longitude": -46.63,
    "avaliacao_media": 5.0
}


        response = self.client.post("/api/usuarios/", payload, format="json")


        self.assertEqual(response.status_code, 201)
        self.assertEqual(Usuario.objects.count(), 1)
        self.assertEqual(Usuario.objects.first().email, "lucas@example.com")

    def test_listar_produtores(self):
        Usuario.objects.create(
            nome="Produtor 1",
            email="p1@example.com",
            senha="123",
            tipo_usuario="produtor",
            latitude = -23.55,
            longitude = -46.63,
            avaliacao_media = 5.0
            
        )

        response = self.client.get("/api/usuarios/produtores/")


        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]["tipo_usuario"], "produtor")