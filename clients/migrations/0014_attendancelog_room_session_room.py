# Generated by Django 5.1.5 on 2025-02-01 00:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clients', '0013_alter_package_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='attendancelog',
            name='room',
            field=models.CharField(choices=[('room_1', 'Sala 1'), ('room_2', 'Sala 2')], default='room_1', max_length=10),
        ),
        migrations.AddField(
            model_name='session',
            name='room',
            field=models.CharField(choices=[('room_1', 'Sala 1'), ('room_2', 'Sala 2')], default='room_1', max_length=10),
        ),
    ]
