from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import ItemViewSet, ReviewViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import RegistroUsuarioView # Importe a view que criamos acima

router = DefaultRouter()
router.register(r'itens', ItemViewSet, basename='item')
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    # Nossas novas rotas de Autenticação
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Essa é a rota de LOGIN
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/registro/', RegistroUsuarioView.as_view(), name='registro'), # Nossa rota de CADASTRO
]