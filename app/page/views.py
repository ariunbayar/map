import json
import requests
import xmltodict

from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required


def home(request):
    return render(request, 'page/home.html', {})


# @login_required
# def home(request):
    # context = {}
    # return render(request, 'page/home.html', context)


@login_required
def wms(request):

    payload = json.loads(request.body)

    base_uri = payload.get('wms')
    queryargs = payload.get('queryargs')

    rsp = requests.get(base_uri, queryargs)
    content_type = rsp.headers.get('content-type')

    return HttpResponse(rsp.content, content_type=content_type)


@login_required
def inspector(request):
    context = {}
    return render(request, 'page/inspector.html', context)


@login_required
def qgis_get_capabilities_json(request):
    data = json.loads(request.body)
    url = data.get('url')

    rsp = requests.get(url)

    content_type = rsp.headers.get('content-type')

    if content_type.startswith('text/xml'):
        data = xmltodict.parse(rsp.content)
        return JsonResponse(data)

    return HttpResponse(rsp.content, content_type=content_type)


@login_required
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

    return JsonResponse({'urls': urls})
