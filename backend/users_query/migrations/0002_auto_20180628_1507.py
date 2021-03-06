# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-06-28 15:07
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import users_query.models


class Migration(migrations.Migration):

    dependencies = [
        ('users_query', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Picture',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file_related', models.FileField(upload_to=users_query.models.get_file_path)),
                ('date_uploaded', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='userquery',
            name='file_related',
        ),
        migrations.AddField(
            model_name='picture',
            name='query',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users_query.UserQuery'),
        ),
    ]
