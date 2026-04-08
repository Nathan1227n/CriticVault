from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Item(models.Model):
    TIPO_CHOICES = [
        ('FILME', 'Filme'),
        ('JOGO', 'Jogo'),
        ('LIVRO', 'Livro'),
    ]
    
    titulo = models.CharField(max_length=200)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    # URL da imagem de capa para aparecer nos cards da sua UI
    capa_url = models.URLField(max_length=500, blank=True, null=True) 

    def __str__(self):
        return f"{self.titulo} ({self.tipo})"

class Review(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='reviews')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    # Notas de 0 a 100 (verde, amarelo, vermelho na sua UI)
    nota = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    texto = models.TextField()
    data_criacao = models.DateTimeField(auto_now_add=True)
    # Relação de muitos-para-muitos para contar quem curtiu
    curtidas = models.ManyToManyField(User, related_name='reviews_curtidas', blank=True)

    def __str__(self):
        return f"{self.item.titulo} - Nota: {self.nota}"