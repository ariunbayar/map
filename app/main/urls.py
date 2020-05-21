from django.urls import path

import page.views
import secure.views


urlpatterns = [

    path('', page.views.home, name='page-home'),
    path('WMS/', page.views.wms, name='page-wms'),

    path('inspector/', page.views.inspector, name='page-inspector'),
    path('inspector/qgis/get-capabilities/json/', page.views.qgis_get_capabilities_json),
    path('inspector/qgis/urls/', page.views.qgis_urls),
    path('inspector/qgis/urls/delete/', page.views.qgis_urls, {'is_delete': True}),


    path('login/', secure.views.login, name='login'),
    path('logout/', secure.views.logout, name='logout'),

]
