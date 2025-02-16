# Generated by Django 3.0.5 on 2020-05-29 13:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('wmslayer', '0001_initial'),
        ('bundle', '0002_bundle_layer'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='bundle',
            name='layer',
        ),
        migrations.CreateModel(
            name='BundleLayer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bundle', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='bundle.Bundle')),
                ('layer', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='layer', to='wmslayer.WMSLayer')),
            ],
        ),
        migrations.AddField(
            model_name='bundle',
            name='layer',
            field=models.ManyToManyField(related_name='bundlelayer', through='bundle.BundleLayer', to='wmslayer.WMSLayer'),
        ),
    ]
