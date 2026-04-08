from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from catalog.views import ItemViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r'itens', ItemViewSet, basename='item')
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # Rotas de autenticação
    path('api/auth/', include('authentication.urls')),
]