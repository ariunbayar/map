from django.shortcuts import render


def home(request):
    context = {}
    return render(request, 'page/home.html', context)
