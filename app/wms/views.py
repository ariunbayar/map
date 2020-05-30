from django.shortcuts import render, redirect
from wms.models import WMS
from bundle.models import Bundle, BundleLayer
from wmslayer.models import WMSLayer
from wms.forms import WMSForm
import json

from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_POST, require_GET

from main.decorators import ajax_required

from .models import WMS
from .forms import WMSForm


def _get_wms_display(wms):
    return {
        'id': wms.id,
        'name': wms.name,
        'url': wms.url,
        'public_url': 'http://localhost:8102/WMS/{}/'.format(wms.pk),
        'created_at': wms.created_at.strftime('%Y-%m-%d'),
    }


@require_GET
def all(request):

    wms_list = [_get_wms_display(ob) for ob in WMS.objects.all()]

    return JsonResponse({'wms_list': wms_list})


@require_POST
def create(request):

    data = json.loads(request.body)

    form = WMSForm(data)

    if form.is_valid():
        form.save()
        return JsonResponse({
                'wms': _get_wms_display(form.instance),
                'success': True
            })
    else:
        return JsonResponse({'success': False})


@require_POST
@ajax_required
def update(request, payload):
    wms = get_object_or_404(WMS, pk=payload.get('id'))
    form = WMSForm(payload, instance=wms)

    if form.is_valid():
        form.save()
        return JsonResponse({
                'wms': _get_wms_display(form.instance),
                'success': True
            })
    else:
        return JsonResponse({'success': False})


@require_POST
@ajax_required
def delete(request, payload):
    wms = get_object_or_404(WMS, pk=payload.get('id'))
    layers = WMSLayer.objects.filter(wms=wms)
    for layer in layers:
        BundleLayer.objects.filter(layer=layer).delete()
        layer.delete()

    wms.delete()

    return JsonResponse({'success': True})


@require_GET
@ajax_required
def api_url(request, pk):
    wms = get_object_or_404(WMS, pk=pk)
    rsp = {
            'url': wms.url,
            'success': True
        }
    return JsonResponse(rsp)
