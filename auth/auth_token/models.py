import os
from django.db import models


class TokenManager(models.Manager):

    def generate_token(size=64):
        return os.urandom(size // 2).hex()


class TokenRefresh(models.Model):

    class Meta:
        db_table = "token_refresh"

    objects = TokenManager()

    token = models.CharField(max_length=64, db_index=True, unique=True)
    user = models.ForeignKey('user.User', on_delete=models.CASCADE)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)


class TokenAccess(models.Model):

    class Meta:
        db_table = "token_access"

    objects = TokenManager()

    token = models.CharField(max_length=64, db_index=True, unique=True)
    user = models.ForeignKey('user.User', on_delete=models.CASCADE)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
