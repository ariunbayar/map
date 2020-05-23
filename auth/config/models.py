from django.db import models


class Config(models.Model):

    name = models.CharField(max_length=255)
    value = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
