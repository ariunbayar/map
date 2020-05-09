import json
import requests
import xmltodict

from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

# from main.qgis_parsers import GetCapabilitiesParser


def home(request):
    context = {}
    return render(request, 'page/home.html', context)


def qgis_get_capabilities_json(request):
    data = json.loads(request.body)
    url = data.get('url')

    # base_uri = settings.QGIS_SERVER['URL']
    # params = {
        # 'SERVICE': 'WMS',
        # 'REQUEST': 'GetCapabilities',
        # 'VERSION': '1.3.0',
    # }
    rsp = requests.get(url)
    capabilities = xmltodict.parse(rsp.content)

    return JsonResponse(capabilities)


def qgis_urls(request, is_delete=False):

    urls = request.session.get('qgis_urls', [])

    if request.method == 'POST':
        url = json.loads(request.body).get('url')

        if is_delete:
            urls = [(k, v) for k, v in urls if not v == url]
        else:
            if len(urls) == 0:
                last_index = 0
            else:
                last_index, _ = urls[-1]
            if url and url not in [v for i, v in urls]:
                urls.append([last_index + 1, url])
        request.session['qgis_urls'] = urls
        print('\n\033[92m\033[01m', end=''); import pprint; pprint.pprint(urls); print('\n\033[0m', end='')

    return JsonResponse({'urls': urls})
