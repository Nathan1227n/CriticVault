from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'criado_em', 'atualizado_em']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['criado_em', 'atualizado_em']
