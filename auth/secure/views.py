import jwt

from django.conf import settings
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_GET

from config.utils import get_config


def _get_user_redir(request, user):

    if request.GET.get('next'):
        return redirect(request.GET.get('next'))

    return redirect(settings.LOGIN_REDIRECT_URL)


@csrf_protect
def login(request):
    context = {}
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        if username and password:
            user = auth.authenticate(request, username=username, password=password)
            if user:
                auth.login(request, user)
                return _get_user_redir(request, user)
            else:
                context['error'] = 'Нэвтрэх нэр, нууц үг буруу байна'
        else:
            context['error'] = 'Нэвтрэх нэр, нууц үгээ оруулна уу'
        context['username'] = username
    return render(request, 'secure/login.html', context)


@require_GET
@login_required
def logout(request):
    auth.logout(request)
    return redirect(settings.LOGOUT_REDIRECT_URL)


@require_GET
@login_required
def token(request):

    payload = {
            'id': request.user.pk,
        }

    secret = get_config('SHARED_SECRET')

    encoded_jwt = jwt.encode(payload, secret, algorithm='HS256')

    return redirect('http://localhost:8100/auth/?t=' + encoded_jwt.decode())
