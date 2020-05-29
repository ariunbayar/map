from django.db import models
from django.conf import settings

from wmslayer.models import WMSLayer

# Create your models here.
class Bundle(models.Model):

    layer = models.ForeignKey(WMSLayer, on_delete=models.PROTECT)
    name = models.CharField(max_length=200)
    price = models.PositiveIntegerField()
    is_removeable = models.BooleanField()

    # created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
