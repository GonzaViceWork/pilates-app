from django.contrib import admin
from .models import Client, Session

# Register your models here.
@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'total_sessions', 'used_sessions', 'remaining_sessions')

@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ('client', 'date', 'attended')