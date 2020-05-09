from django.urls import path

import page.views


urlpatterns = [

    path('', page.views.home, name='page-home'),
    path('qgis/get-capabilities/json/', page.views.qgis_get_capabilities_json),
    path('qgis/urls/', page.views.qgis_urls),
    path('qgis/urls/delete/', page.views.qgis_urls, {'is_delete': True}),

]
