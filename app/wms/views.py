from django.shortcuts import render, redirect
from wms.models import WMS
from wms.forms import WMSForm


# Create your views here.
def list(request):
    wms_list = WMS.objects.all()

    context = {
            'wms_list': wms_list,
        }

    return render(request, 'wms/list.html', context)


def add(request):
    if request.method == 'POST':

        form = WMSForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect('wms:list')

    else:

        form = WMSForm()

    context = {
            'form': form
        }
    return render(request, 'wms/form.html', context)


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


def delete(request, pk):
    pass
