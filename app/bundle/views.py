from django.shortcuts import render, redirect
from bundle.models import Bundle, BundleLayer
from bundle.forms import BundleForm


# Create your views here.
def list(request):
    bundle_list = Bundle.objects.all()

    context = {
            'bundle_list': bundle_list,
        }

    return render(request, 'bundle/list.html', context)


def add(request):
    if request.method == 'POST':

        form = BundleForm(request.POST)

        if form.is_valid():
            form.instance.is_removeable = True 
            form.save()
            return redirect('bundle:list')

    else:

        form = BundleForm()

    context = {
            'form': form
        }
    return render(request, 'bundle/form.html', context)


def edit(request, pk):

    bundle = Bundle.objects.get(pk=pk)

    if request.method == 'POST':

        form = BundleForm(request.POST, instance=bundle)

        if form.is_valid():
            form.save()
            return redirect('bundle:list')
    else:

        form = BundleForm(instance=bundle)

    context = {
            'form': form,
        }

    return render(request, 'bundle/form.html', context)


def delete(request, pk):
    BundleLayer.objects.filter(bundle=pk).delete()
    Bundle.objects.get(pk=pk).delete()
    return redirect('bundle:list')
