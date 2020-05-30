import json

from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_POST, require_GET

from bundle.models import Bundle, BundleLayer
from main.decorators import ajax_required
from wmslayer.models import WMSLayer

from .models import WMS
from .forms import WMSForm


def _get_wms_display(wms):
    return {
        'id': wms.id,
        'name': wms.name,
        'url': wms.url,
        'layers': [ob.code for ob in wms.wmslayer_set.all()],
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

    print(data)
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
    layers = payload.get('layers')
    layer_choices = payload.get('layer_choices')
    form = WMSForm(payload, instance=wms)
    print(payload)

    if form.is_valid():

        with transaction.atomic():

            form.save()
            wms = form.instance

            # cleanup wms relations
            BundleLayer.objects.filter(layer__wms_id=wms.pk).delete()
            wms.wmslayer_set.all().delete()

            for layer_choices in layer_choices:
                if layer_choices.get('code') in layers:
                    WMSLayer.objects.create(
                        wms=form.instance,
                        name=layer_choices.get('name'),
                        code=layer_choices.get('code'),
                    )

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
