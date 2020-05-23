from django.urls import path, include

import secure.views
import config.views


urlpatterns = [
    path('login/', secure.views.login, name='login'),
    path('logout/', secure.views.logout, name='logout'),
    path('token/', secure.views.token, name='token'),

    path('config/', include(
        (
            [
                path('', config.views.index, name='index'),
                path('<int:pk>/remove/', config.views.delete, name='delete'),
            ],
            'config'
        )
    )),
]
