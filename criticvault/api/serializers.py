from rest_framework import serializers
from .models import Item, Review
from django.contrib.auth.models import User

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    # Isso puxa o nome do usuário e os dados do item para o React não ter que fazer 3 requisições
    nome_usuario = serializers.ReadOnlyField(source='usuario.username')
    titulo_item = serializers.ReadOnlyField(source='item.titulo')
    tipo_item = serializers.ReadOnlyField(source='item.tipo')
    capa_item = serializers.ReadOnlyField(source='item.capa_url')
    total_curtidas = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'nota', 'texto', 'data_criacao', 'nome_usuario', 'titulo_item', 'tipo_item', 'capa_item', 'total_curtidas', 'item', 'usuario']

    def get_total_curtidas(self, obj):
        return obj.curtidas.count()