from django.apps import apps


def get_config(name, default=None):
    Config = apps.get_model('config', 'Config')
    config = Config.objects.filter(name=name).last()
    return config.value if config else default
