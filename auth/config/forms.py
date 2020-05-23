from django import forms

from .models import Config

default_error_messages = {
    'required': "оруулна уу!",
}


error_messages = {
        'min_length': 'Хайх утга богино байна!',
        'invalid': 'Зөв оруулна уу',
    }

date_error_messages = {
        'invalid': 'Огноог yyyy-mm-dd гэсэн загвараар оруулна уу! Жишээ нь: 2020-07-25',
    }


class ConfigForm(forms.ModelForm):

    class Meta:

        model = Config

        fields = [
                'name',
                'value',
            ]

        labels = {
                'name': 'Нэр',
                'value': 'Утга',
            }

        widgets = {
                'value': forms.Textarea,
            }

        error_messages = {
                'name': default_error_messages,
                'value': default_error_messages,
            }
