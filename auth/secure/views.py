from datetime import timedelta
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.utils.timezone import localtime, now

from auth_token.models import TokenRefresh, TokenAccess
from user.models import User


@require_POST
def token_obtain(request):

    username = request.POST.get('username')
    password = request.POST.get('password')

    user = User.objects.all().last()
    is_valid = username == 'user' and password == 'user'

    if is_valid and user:

        token_refresh = TokenRefresh()
        token_refresh.token = TokenRefresh.objects.generate_token()
        token_refresh.user = user
        token_refresh.expires_at = localtime(now()) + timedelta(days=30)
        token_refresh.save()

        token_access = TokenAccess()
        token_access.token = TokenAccess.objects.generate_token()
        token_access.user = user
        token_access.expires_at = localtime(now()) + timedelta(hours=1)
        token_access.save()

        context = {
                'refresh': token_refresh.token,
                'access': token_access.token,
            }
        return JsonResponse(context)

    else:

        context = {'алдаа': "Нэвтрэх нэр, нууц үг буруу байна"}
        return JsonResponse(context, status=400)
