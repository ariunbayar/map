from django.urls import path

import wms.views

urlpatterns = [
    path('WMS/<int:wms_id>/', wms.views.proxy),
]
