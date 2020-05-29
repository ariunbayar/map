import json

from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.http import require_POST, require_GET

from .models import WMS
from .forms import WMSForm


def _get_wms_display(wms):
    return {
        'id': wms.id,
        'name': wms.name,
        'url': wms.url,
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


def edit(request, pk):

    wms = WMS.objects.get(pk=pk)

    if request.method == 'POST':

        form = WMSForm(request.POST, instance=wms)

        if form.is_valid():
            form.save()
            return redirect('wms:list')
    else:

        form = WMSForm(instance=wms)

    context = {
            'form': form,
        }

    return render(request, 'wms/form.html', context)


def delete(request):
    try:
        data = json.loads(request.body)
        WMS.objects.get(pk=data.get('id')).delete()
    except:
        rsp = {'success': False}
    else:
        rsp = {'success': True}

    return JsonResponse(rsp)
