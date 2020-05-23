from django.urls import path, include

import secure.views


urlpatterns = [
    path('login/', secure.views.login, name='login'),
    path('logout/', secure.views.logout, name='logout'),
    path('token/', secure.views.token, name='token'),
]
