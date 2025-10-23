
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("usuarios.urls")),
    path('', RedirectView.as_view(url='/api/usuarios/', permanent=False), name='index_redirect'),
]
