from django.db import models
from django.conf import settings

from wms.models import WMS

# Create your models here.
class WMSLayer(models.Model):

    wms = models.ForeignKey(WMS, on_delete=models.PROTECT)
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=200)

    # created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
