from .settings import *

#to run python manage.py test --settings=reciclaai.settings_test

# Usar SQLite nos testes
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",  # Banco só na memória
    }
}

# (opcional) desabilitar o debug toolbar ou plugins que exigem PostgreSQL
INSTALLED_APPS = [app for app in INSTALLED_APPS if app != "debug_toolbar"]