from django.shortcuts import render, redirect
from django.views.decorators.http import require_POST, require_GET
from django.http import JsonResponse
import json

from bundle.models import Bundle, BundleLayer
from wms.models import WMS
from wmslayer.models import WMSLayer
from bundle.forms import BundleForm


def _get_bundle_options():

    form_options = []

    for wms in WMS.objects.all():
        layers = [{'id':layer.id, 'name':layer.name} for layer in WMSLayer.objects.filter(wms=wms)]
        form_options.append({
            'wms': wms.name,
            'layers':layers,
            })

    return form_options


def _get_bundle_update(bundle):

    bundle_data = []
    layers = [(layer.id) for layer in BundleLayer.objects.filter(bundle=bundle)]
    bundle_data.append({
        'id': bundle.id,
        'name': bundle.name,
        'price': bundle.price,
        'layers':layers,
        })

    return bundle_data


@require_GET
def all(request):
    bundle_list = []

    for bundle in Bundle.objects.all():
        wms_service = [( WMS.objects.get(pk=wms[0]).name ) for wms in BundleLayer.objects.filter(bundle=bundle).values_list('layer__wms_id').distinct()]
        
        bundle_list.append({
            'id': bundle.id,
            'name': bundle.name,
            'price': bundle.price,
            'wms_service': wms_service
        })

    return JsonResponse({'bundle_list': bundle_list})


@require_POST
def create(request):

    data = json.loads(request.body)
    form = BundleForm(data)
    if form.is_valid():
        form.instance.is_removeable = True 
        form.save()
        return JsonResponse({
                'success': True
            })
    else:
        return JsonResponse({
            'form_options': _get_bundle_options(),
            'success': False
            })


@require_POST
def update(request, pk):
    bundle = Bundle.objects.get(pk=pk)

    data = json.loads(request.body)
    form = BundleForm(data, instance=bundle)

    if form.is_valid():
        form.save()
        return JsonResponse({
                'success': True
            })
    else:

        return JsonResponse({
            'form_options': _get_bundle_options(),
            'bundle_json': _get_bundle_update(bundle),
            'success': False
            })


@require_POST
def remove(request, pk):

    BundleLayer.objects.filter(bundle=pk).delete()
    Bundle.objects.get(pk=pk).delete()
    return JsonResponse({
                    'success': True
                })