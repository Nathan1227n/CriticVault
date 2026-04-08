from rest_framework import viewsets
from .models import Item, Review
from .serializers import ItemSerializer, ReviewSerializer
from django.contrib.auth.models import User
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

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
    
class RegistroUsuarioView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        # Extraindo dados do request (Email será usado como username por simplicidade, ou você pode separar)
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not password or not email:
            return Response({'erro': 'Preencha todos os campos'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'erro': 'Usuário já existe'}, status=status.HTTP_400_BAD_REQUEST)

        # Criando o usuário
        user = User.objects.create_user(username=username, email=email, password=password)

        # Gerando os tokens para já logar o usuário após o cadastro
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)