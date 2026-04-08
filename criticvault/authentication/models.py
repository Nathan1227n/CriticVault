from django.db import models
from django.contrib.auth.models import User

# Estender o User padrão do Django quando necessário
# Por enquanto, vamos usar o User padrão
# Mas deixamos este arquivo aberto para extensões futuras

class UserProfile(models.Model):
    """Perfil estendido do usuário"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    avatar_url = models.URLField(blank=True, null=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Perfil de Usuário'
        verbose_name_plural = 'Perfis de Usuários'

    def __str__(self):
        return f"{self.user.username} - Perfil"
