from itertools import groupby
import json

from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from django.http import JsonResponse

from main.decorators import ajax_required
from wms.models import WMS
from wmslayer.models import WMSLayer

from .forms import BundleForm
from .models import Bundle, BundleLayer


def _get_bundle_options():

    form_options = []

    for wms in WMS.objects.all():
        layers = list(WMSLayer.objects.filter(wms=wms).values('id', 'name'))
        wms_display = {
                'name': wms.name,
                'layers': layers,
            }
        form_options.append(wms_display)

    return form_options


def _get_bundle_display(bundle):
    return {
        'id': bundle.id,
        'name': bundle.name,
        'price': bundle.price,
        'layers': list(bundle.layers.all().values_list('id', flat=True)),
        'is_removeable': bundle.is_removeable,
        'wms_list': [(WMS.objects.get(pk=wms[0]).name ) for wms in BundleLayer.objects.filter(bundle=bundle).values_list('layer__wms_id').distinct()],
    }


@require_GET
@ajax_required
def all(request):

    bundle_list = [_get_bundle_display(ob) for ob in Bundle.objects.all()]
    form_options = _get_bundle_options()

    rsp = {
            'bundle_list': bundle_list,
            'form_options': form_options,
        }

    return JsonResponse(rsp)


@require_POST
@ajax_required
def create(request, payload):

    form = BundleForm(payload)
    if form.is_valid():
        form.instance.is_removeable = True
        form.save()
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False})


@require_POST
@ajax_required
def update(request, payload):

    bundle = get_object_or_404(Bundle, pk=payload.get('id'))
    form = BundleForm(payload, instance=bundle)

    if form.is_valid():
        form.save()
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False})


@require_POST
@ajax_required
def remove(request, payload):

    pk = payload.get('id')

    bundle = get_object_or_404(Bundle, pk=pk, is_removeable=True)

    bundle.layers.all().delete()
    bundle.delete()

    return JsonResponse({'success': True})


@require_POST
@ajax_required
def wms_layers(request, payload):

    bundle = get_object_or_404(Bundle, pk=payload.get('id'))

    wms_list = []

    qs_layers = bundle.layers.all().order_by('wms__created_at')
    _layer_to_display = lambda ob: {'name': ob.name, 'code': ob.code}
    for wms, layers in groupby(qs_layers, lambda ob: ob.wms):
        wms_data = {
                'name': wms.name,
                'url': 'http://localhost:8102/WMS/{}/'.format(wms.pk),
                'layers': [_layer_to_display(l) for l in layers],
            }
        wms_list.append(wms_data)


    rsp = {
        'wms_list': wms_list,
    }

    return JsonResponse(rsp)
