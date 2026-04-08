from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegistroView,
    LoginView,
    MeView,
    ProfileView,
    LogoutView
)

urlpatterns = [
    # Autenticação básica
    path('registro/', RegistroView.as_view(), name='registro'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # Dados do usuário
    path('me/', MeView.as_view(), name='me'),
    path('profile/', ProfileView.as_view(), name='profile'),
    
    # Token refresh (JWT)
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
