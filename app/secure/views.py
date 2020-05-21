from django.conf import settings
from django.contrib import auth
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect


def login(request):

    User = get_user_model()
    user = User.objects.all().first()
    if not user:
        user = User.objects.create_user('regular_user', 'regular_user@example.com', 'RonyacsyucomWyujyedyiewdIgDoagOd')

    auth.login(request, user)
    return redirect(settings.LOGIN_REDIRECT_URL)


@login_required
def logout(request):
    auth.logout(request)
    return redirect(settings.LOGOUT_REDIRECT_URL)
