# Generated by Django 3.0.5 on 2020-05-30 12:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bundle', '0004_auto_20200530_0832'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bundle',
            old_name='layer',
            new_name='layers',
        ),
    ]
