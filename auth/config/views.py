from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404

from .models import Config
from .forms import ConfigForm


@login_required
def index(request):

    configs = Config.objects.all()

    if request.method == 'POST':

        form = ConfigForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('config:index')

    else:

        form = ConfigForm()


    context = {
        'configs': configs,
        'form': form
    }

    return render(request, 'config/index.html', context)


@login_required
def delete(request, pk):
    get_object_or_404(Config, pk=pk).delete()
    return redirect('config:index')
