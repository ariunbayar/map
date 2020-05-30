import requests

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest
from django.views.decorators.http import require_GET


BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }


def _get_wms_url_by_id(wms_id):

    # TODO set this url configurable
    url = 'http://localhost:8100/api/wms/{}/url/'.format(wms_id)

    headers = {
            **BASE_HEADERS,
            'X-Requested-With': 'XMLHttpRequest',
        }

    try:
        rsp = requests.get(url, headers=headers)
        if rsp.status_code == 200:
            return rsp.json().get('url')
    except:
        pass


@require_GET
def proxy(request, wms_id):

    base_url = _get_wms_url_by_id(wms_id)
    if not base_url:
        return HttpResponseBadRequest()

    queryargs = request.GET
    headers = {**BASE_HEADERS}
    rsp = requests.get(base_url, queryargs, headers=headers)

    content_type = rsp.headers.get('content-type')

    return HttpResponse(rsp.content, content_type=content_type)
