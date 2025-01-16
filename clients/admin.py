from django.contrib import admin
from .models import Client, Session, Package

# Register your models here.
class ClientAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'total_sessions', 'used_sessions', 'remaining_sessions']
    search_fields = ['name', 'email']

class SessionAdmin(admin.ModelAdmin):
    list_display = ['get_clients', 'session_type', 'date', 'attended']
    list_filter = ['session_type', 'attended', 'date']
    search_fields = ['clients__name', 'clients__email']

    def get_clients(self, obj):
        return ", ".join([client.name for client in obj.clients.all()])
    get_clients.short_description = 'Clientes'

class PackageAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'total_sessions']
    search_fields = ['name']

admin.site.register(Client, ClientAdmin)
admin.site.register(Session, SessionAdmin)
admin.site.register(Package, PackageAdmin)