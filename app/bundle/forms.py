from django import forms
from .models import Bundle

class BundleForm(forms.ModelForm):

    class Meta:

        model = Bundle


        fields = [
                'name',
                'price',
                'layer'
            ]

        widgets = {'layer': forms.CheckboxSelectMultiple,}

        labels = {
                'name': 'Багцийн нэр',
                'price': 'Багцийн үнэ',
                'layer': 'Давхаргууд',
            }

        error_messages = {
                'name': {'required': 'Оруулна уу!'},
                'price': {'required': 'Оруулна уу!'},
                'layer': {'required': 'Оруулна уу!'},
            }