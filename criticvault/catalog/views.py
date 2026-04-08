from rest_framework import viewsets
from .models import Item, Review
from .serializers import ItemSerializer, ReviewSerializer


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        # CORREÇÃO AQUI: Usando order_by('-data_criacao')
        queryset = Review.objects.all().order_by('-data_criacao') 
        
        tipo = self.request.query_params.get('tipo', None)
        if tipo is not None:
            queryset = queryset.filter(item__tipo=tipo)
        return queryset