from django.contrib import admin
from .models import Item, Review

# Registrando os modelos para aparecerem no painel Admin
admin.site.register(Item)
admin.site.register(Review)