from django.shortcuts import render
from rest_framework import viewsets
from .models import Coleta
from .serializers import ColetaSerializer

# Create your views here.

class ColetaViewSet(viewsets.ModelViewSet):
    queryset = Coleta.objects.all()
    serializer_class = ColetaSerializer
