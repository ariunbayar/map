from django.urls import path

import page.views


urlpatterns = [

    path('', page.views.home, name='page-home'),

    path('inspector/', page.views.inspector, name='page-inspector'),
    path('inspector/qgis/get-capabilities/json/', page.views.qgis_get_capabilities_json),
    path('inspector/qgis/urls/', page.views.qgis_urls),
    path('inspector/qgis/urls/delete/', page.views.qgis_urls, {'is_delete': True}),

]
