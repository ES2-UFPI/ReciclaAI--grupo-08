from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import (
    Usuario, Residuo, Carga, CargaResiduo, Coleta,
    Avaliacao, Pontos, Recebimento, UsuarioResiduo
)


#  -----------------------
#  USUÁRIO

class UsuarioTests(APITestCase):

    def setUp(self):
        self.url = "/api/usuarios/"
        self.default_payload = {
            "nome": "Teste User",
            "email": "user@test.com",
            "senha": "1234",
            "tipo_usuario": "produtor",
            "latitude": -23.55,
            "longitude": -46.63,
            "avaliacao_media": 0
        }

    def test_criar_usuario(self):
        response = self.client.post(self.url, self.default_payload, format="json")
        self.assertEqual(response.status_code, 201)

    def test_listar_usuarios(self):
        Usuario.objects.create(**self.default_payload)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_buscar_usuario(self):
        usuario = Usuario.objects.create(**self.default_payload)
        response = self.client.get(f"{self.url}{usuario.id}/")
        self.assertEqual(response.status_code, 200)

    def test_atualizar_usuario(self):
        usuario = Usuario.objects.create(**self.default_payload)
        response = self.client.patch(
            f"{self.url}{usuario.id}/",
            {"nome": "Nome Atualizado"},
            format="json"
        )
        self.assertEqual(response.status_code, 200)

    def test_deletar_usuario(self):
        usuario = Usuario.objects.create(**self.default_payload)
        response = self.client.delete(f"{self.url}{usuario.id}/")
        self.assertEqual(response.status_code, 204)


# -----------------------
#  RESÍDUO

class ResiduoTests(APITestCase):

    def setUp(self):
        self.url = "/api/residuos/"
        self.payload = {
            "tipo": "Papel",
            "valor_kg": 2.50
        }

    def test_crud_residuo(self):
        # CREATE
        res = self.client.post(self.url, self.payload, format="json")
        self.assertEqual(res.status_code, 201)
        rid = res.data["id"]

        # LIST
        res = self.client.get(self.url)
        self.assertEqual(res.status_code, 200)

        # GET BY ID
        res = self.client.get(f"{self.url}{rid}/")
        self.assertEqual(res.status_code, 200)

        # UPDATE
        res = self.client.patch(f"{self.url}{rid}/", {"tipo": "Plástico"}, format="json")
        self.assertEqual(res.status_code, 200)

        # DELETE
        res = self.client.delete(f"{self.url}{rid}/")
        self.assertEqual(res.status_code, 204)


# -----------------------
#  CARGA

class CargaTests(APITestCase):

    def setUp(self):
        self.url = "/api/cargas/"
        self.user = Usuario.objects.create(
            nome="Produtor",
            email="p@teste.com",
            senha="123",
            tipo_usuario="produtor",
            latitude=-23.5,
            longitude=-46.6,
            avaliacao_media=0
        )
        self.payload = {"produtor": self.user.id, "status": "aberta"}

    def test_crud_carga(self):
        r = self.client.post(self.url, self.payload, format="json")
        self.assertEqual(r.status_code, 201)
        cid = r.data["id"]

        r = self.client.get(self.url)
        self.assertEqual(r.status_code, 200)

        r = self.client.get(f"{self.url}{cid}/")
        self.assertEqual(r.status_code, 200)

        r = self.client.patch(f"{self.url}{cid}/", {"status": "fechada"}, format="json")
        self.assertEqual(r.status_code, 200)

        r = self.client.delete(f"{self.url}{cid}/")
        self.assertEqual(r.status_code, 204)


#  -----------------------
#  CARGA_RESÍDUO

class CargaResiduoTests(APITestCase):

    def setUp(self):
        self.url = "/api/carga-residuos/"

        self.usuario = Usuario.objects.create(
            nome="Produtor",
            email="prod@test.com",
            senha="123",
            tipo_usuario="produtor",
            latitude=-23.5,
            longitude=-46.6,
            avaliacao_media=0
        )

        self.carga = Carga.objects.create(produtor=self.usuario, status="aberta")
        self.residuo = Residuo.objects.create(tipo="Papel", valor_kg=1.50)

        self.payload = {
            "carga": self.carga.id,
            "residuo": self.residuo.id,
            "peso_kg": 10,
            "valor": 15
        }

    def test_crud_carga_residuo(self):
        r = self.client.post(self.url, self.payload, format="json")
        self.assertEqual(r.status_code, 201)
        cid = r.data["id"]

        self.assertEqual(self.client.get(self.url).status_code, 200)
        self.assertEqual(self.client.get(f"{self.url}{cid}/").status_code, 200)
        self.assertEqual(
            self.client.patch(f"{self.url}{cid}/", {"peso_kg": 20}, format="json").status_code,
            200
        )
        self.assertEqual(self.client.delete(f"{self.url}{cid}/").status_code, 204)


#  -----------------------
#  COLETA

class ColetaTests(APITestCase):

    def setUp(self):
        self.url = "/api/coletas/"

        self.coletor = Usuario.objects.create(
            nome="Coletor",
            email="c@teste.com",
            senha="123",
            tipo_usuario="coletor",
            latitude=-23.5,
            longitude=-46.6,
            avaliacao_media=0
        )

        self.produtor = Usuario.objects.create(
            nome="Produtor",
            email="p@teste.com",
            senha="123",
            tipo_usuario="produtor",
            latitude=-23.5,
            longitude=-46.6,
            avaliacao_media=0
        )

        self.carga = Carga.objects.create(produtor=self.produtor, status="aberta")

        self.payload = {"coletor": self.coletor.id, "carga": self.carga.id}

    def test_crud_coleta(self):
        r = self.client.post(self.url, self.payload, format="json")
        self.assertEqual(r.status_code, 201)
        cid = r.data["id"]

        self.assertEqual(self.client.get(self.url).status_code, 200)
        self.assertEqual(self.client.get(f"{self.url}{cid}/").status_code, 200)
        self.assertEqual(self.client.patch(f"{self.url}{cid}/", {"status": "finalizada"}, format="json").status_code, 200)
        self.assertEqual(self.client.delete(f"{self.url}{cid}/").status_code, 204)


 #-----------------------
#  AVALIAÇÃO

class AvaliacaoTests(APITestCase):

    def setUp(self):
        self.url = "/api/avaliacoes/"

        self.u1 = Usuario.objects.create(
            nome="Avaliador",
            email="ava@t.com",
            senha="123",
            tipo_usuario="produtor",
            latitude=-23.5,
            longitude=-46.6,
            avaliacao_media=0
        )

        self.u2 = Usuario.objects.create(
            nome="Avaliado",
            email="ava2@t.com",
            senha="123",
            tipo_usuario="produtor",
            latitude=-23.5,
            longitude=-46.6,
            avaliacao_media=0
        )

        self.payload = {"avaliador": self.u1.id, "avaliado": self.u2.id, "nota": 5}

    def test_crud_avaliacao(self):
        r = self.client.post(self.url, self.payload, format="json")
        self.assertEqual(r.status_code, 201)
        aid = r.data["id"]

        self.assertEqual(self.client.get(self.url).status_code, 200)
        self.assertEqual(self.client.get(f"{self.url}{aid}/").status_code, 200)
        self.assertEqual(self.client.patch(f"{self.url}{aid}/", {"nota": 3}, format="json").status_code, 200)
        self.assertEqual(self.client.delete(f"{self.url}{aid}/").status_code, 204)


#  -----------------------
#  PONTOS

class PontosTests(APITestCase):

    def setUp(self):
        self.url = "/api/pontos/"

        self.user = Usuario.objects.create(
            nome="User",
            email="user@p.com",
            senha="123",
            tipo_usuario="produtor",
            latitude=-23.5,
            longitude=-46.6,
            avaliacao_media=0
        )

        self.carga = Carga.objects.create(produtor=self.user, status="aberta")

        self.payload = {
            "usuario": self.user.id,
            "carga": self.carga.id,
            "pontos": 10
        }

    def test_crud_pontos(self):
        r = self.client.post(self.url, self.payload, format="json")
        self.assertEqual(r.status_code, 201)
        pid = r.data["id"]

        self.assertEqual(self.client.get(self.url).status_code, 200)
        self.assertEqual(self.client.get(f"{self.url}{pid}/").status_code, 200)
        self.assertEqual(self.client.patch(f"{self.url}{pid}/", {"pontos": 20}, format="json").status_code, 200)
        self.assertEqual(self.client.delete(f"{self.url}{pid}/").status_code, 204)


# -----------------------
#  RECEBIMENTO

class RecebimentoTests(APITestCase):

    def setUp(self):
        self.url = "/api/recebimentos/"

        self.user = Usuario.objects.create(
            nome="Receptor",
            email="r@t.com",
            senha="123",
            tipo_usuario="receptor",
            latitude=-23.5,
            longitude=-46.6,
            avaliacao_media=0
        )

        self.produtor = Usuario.objects.create(
            nome="Produtor",
            email="prodrec@t.com",
            senha="123",
            tipo_usuario="produtor",
            latitude=-23.5,
            longitude=-46.6,
            avaliacao_media=0
        )

        self.carga = Carga.objects.create(produtor=self.produtor, status="aberta")

        self.payload = {"receptor": self.user.id, "carga": self.carga.id, "peso_confirmado": 50}

    def test_crud_recebimento(self):
        r = self.client.post(self.url, self.payload, format="json")
        self.assertEqual(r.status_code, 201)
        rid = r.data["id"]

        self.assertEqual(self.client.get(self.url).status_code, 200)
        self.assertEqual(self.client.get(f"{self.url}{rid}/").status_code, 200)
        self.assertEqual(self.client.patch(f"{self.url}{rid}/", {"peso_confirmado": 80}, format="json").status_code, 200)
        self.assertEqual(self.client.delete(f"{self.url}{rid}/").status_code, 204)


# ============================================================
#  USUÁRIO-RESÍDUO
# ============================================================
class UsuarioResiduoTests(APITestCase):

    def setUp(self):
        self.url = "/api/usuario-residuos/"

        self.user = Usuario.objects.create(
            nome="User",
            email="u@u.com",
            senha="123",
            tipo_usuario="produtor",
            latitude=-23.5,
            longitude=-46.6,
            avaliacao_media=0
        )

        self.res = Residuo.objects.create(tipo="Vidro", valor_kg=0.5)

        self.payload = {"usuario": self.user.id, "residuos": self.res.id}

    def test_crud_usuario_residuo(self):
        r = self.client.post(self.url, self.payload, format="json")
        self.assertEqual(r.status_code, 201)
        uid = r.data["usuario"]

        self.assertEqual(self.client.get(self.url).status_code, 200)
        self.assertEqual(self.client.get(f"{self.url}{uid}/").status_code, 200)      
        self.assertEqual(self.client.delete(f"{self.url}{uid}/").status_code, 204)