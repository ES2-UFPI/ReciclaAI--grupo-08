from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Usuario, Coletor, Receptor, ResiduoAceito
from validate_docbr import CPF, CNPJ
from residuos.models import Residuo
from decimal import Decimal

class UsuarioAPITests(APITestCase):
 
    def setUp(self):
        self.list_create_url = reverse('usuario-list')
        cpf_generator = CPF()

        # Cria resíduos para usar nos testes
        self.residuo_plastico = Residuo.objects.create(tipo='PLASTICO', valor=Decimal('1.50'))
        self.residuo_vidro = Residuo.objects.create(tipo='VIDRO', valor=Decimal('0.80'))
        self.residuo_metal = Residuo.objects.create(tipo='METAL', valor=Decimal('3.00'))
        
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

    def test_criar_usuario_receptor_com_residuos(self):
        cnpj_generator = CNPJ()
        data = {
            "username": "receptortest",
            "password": "password123",
            "first_name": "Empresa",
            "last_name": "Receptora",
            "email": "receptor@test.com",
            "tipo_usuario": "RECEPTOR",
            "cpf": CPF().generate(),
            "telefone": "(11) 98888-7777",
            "endereco_completo": "Avenida dos Receptores, 100",
            "perfil_receptor": {
                "nome_empresa": "Recicla Tudo SA",
                "cnpj": cnpj_generator.generate(),
                "endereco_comercial": "Avenida Industrial, 200",
                "horario_funcionamento": "Seg-Sex 08:00-18:00",
                "residuos_aceitos": [
                    {
                        "residuo": self.residuo_plastico.id,
                        "quantidade_minima": "10.00",
                        "preco_unidade": "1.50",
                        "unidade_medida": "KG"
                    },
                    {
                        "residuo": self.residuo_vidro.id,
                        "quantidade_minima": "5.00",
                        "preco_unidade": "0.80",
                        "unidade_medida": "KG"
                    }
                ]
            }
        }
        response = self.client.post(self.list_create_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Usuario.objects.count(), 2)
        self.assertEqual(Receptor.objects.count(), 1)
        self.assertEqual(ResiduoAceito.objects.count(), 2)

        new_user = Usuario.objects.get(username="receptortest")
        self.assertTrue(hasattr(new_user, 'perfil_receptor'))
        self.assertEqual(new_user.perfil_receptor.residuos_aceitos.count(), 2)
        self.assertTrue(new_user.perfil_receptor.tipos_de_residuo_aceitos.filter(tipo='PLASTICO').exists())

    def test_criar_receptor_com_cnpj_invalido(self):
        data = {
            "username": "receptortest_cnpj_invalido",
            "password": "password123",
            "first_name": "Empresa",
            "last_name": "Receptora",
            "email": "receptor_invalido@test.com",
            "tipo_usuario": "RECEPTOR",
            "cpf": CPF().generate(),
            "telefone": "(11) 98888-7777",
            "endereco_completo": "Avenida dos Receptores, 100",
            "perfil_receptor": {
                "nome_empresa": "Recicla Nada SA",
                "cnpj": "12.345.678/0001-00", # CNPJ Inválido
                "endereco_comercial": "Avenida Industrial, 200",
                "horario_funcionamento": "Seg-Sex 08:00-18:00",
            }
        }
        response = self.client.post(self.list_create_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('perfil_receptor', response.data)
        self.assertIn('cnpj', response.data['perfil_receptor'])

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

    def test_atualizar_perfil_receptor_com_residuos(self):
        # Primeiro, cria um usuário Receptor para ser atualizado
        receptor_user = Usuario.objects.create_user(
            username="receptor_para_update", password="password123", tipo_usuario="RECEPTOR",
            cpf=CPF().generate(), first_name="Receptor", last_name="Antigo"
        )
        receptor_profile = Receptor.objects.create(
            usuario=receptor_user, nome_empresa="Empresa Antiga", cnpj=CNPJ().generate()
        )
        # Adiciona um resíduo inicial
        ResiduoAceito.objects.create(
            receptor=receptor_profile, residuo=self.residuo_plastico, quantidade_minima=1, preco_unidade=1, unidade_medida="KG"
        )
        self.assertEqual(receptor_profile.residuos_aceitos.count(), 1)

        update_data = {
            "perfil_receptor": {
                "nome_empresa": "Empresa Nova e Melhorada",
                "residuos_aceitos": [
                    {
                        "residuo": self.residuo_vidro.id,
                        "quantidade_minima": "20.00",
                        "preco_unidade": "0.99",
                        "unidade_medida": "KG"
                    },
                    {
                        "residuo": self.residuo_metal.id,
                        "quantidade_minima": "5.00",
                        "preco_unidade": "4.50",
                        "unidade_medida": "KG"
                    }
                ]
            }
        }

        detail_url = reverse('usuario-detail', kwargs={'pk': receptor_user.pk})
        response = self.client.patch(detail_url, update_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        receptor_profile.refresh_from_db()
        self.assertEqual(receptor_profile.nome_empresa, "Empresa Nova e Melhorada")
        self.assertEqual(receptor_profile.residuos_aceitos.count(), 2)
        # Verifica se o resíduo antigo (plástico) foi removido
        self.assertFalse(receptor_profile.tipos_de_residuo_aceitos.filter(tipo='PLASTICO').exists())
        # Verifica se o novo resíduo (metal) foi adicionado
        self.assertTrue(receptor_profile.tipos_de_residuo_aceitos.filter(tipo='METAL').exists())

    def test_deletar_usuario(self):
        response = self.client.delete(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Usuario.objects.count(), 0)
