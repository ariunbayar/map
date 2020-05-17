import json
import requests
import xmltodict

from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt


def home(request):
    context = {}
    return render(request, 'page/home.html', context)


def wms(request):

    payload = json.loads(request.body)

    base_uri = payload.get('wms')
    queryargs = payload.get('queryargs')

    rsp = requests.get(base_uri, queryargs)
    content_type = rsp.headers.get('content-type')

    return HttpResponse(rsp.content, content_type=content_type)


def inspector(request):
    context = {}
    return render(request, 'page/inspector.html', context)


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

    content_type = rsp.headers.get('content-type')

    print('\n\033[92m\033[01m', end=''); import pprint; pprint.pprint(content_type); print('\n\033[0m', end='')

    if content_type.startswith('text/xml'):
        data = xmltodict.parse(rsp.content)
        return JsonResponse(data)

    return HttpResponse(rsp.content, content_type=content_type)


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
