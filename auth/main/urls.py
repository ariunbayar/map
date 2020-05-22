from django.urls import path, include

import secure.views


urlpatterns = [
    path('api/', include([
        path('token/obtain/', secure.views.token_obtain),
    ])),
]
