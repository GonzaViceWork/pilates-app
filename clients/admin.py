from django.contrib import admin
from .models import Client, Session, Package, SessionPack
from .forms import AddSessionsForm

# Función personalizada para mostrar las sesiones restantes
def remaining_sessions(client):
    return client.remaining_sessions()

remaining_sessions.short_description = 'Sesiones Restantes'

class ClientAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'total_sessions', 'used_sessions', remaining_sessions]
    search_fields = ['name', 'email']
    actions = ['add_sessions_action', 'deduct_sessions_action']  # Define las acciones directamente aquí

    # Acción para añadir sesiones a un cliente
    def add_sessions_action(self, request, queryset):
        amount = request.POST.get('amount', 0)
        for client in queryset:
            client.add_sessions(int(amount))
        self.message_user(request, f'Se han añadido {amount} sesiones a los clientes seleccionados.')

    # Acción para descontar sesiones a un cliente
    def deduct_sessions_action(self, request, queryset):
        amount = request.POST.get('amount', 0)
        for client in queryset:
            try:
                client.deduct_sessions(int(amount))
                self.message_user(request, f'Se han descontado {amount} sesiones a los clientes seleccionados.')
            except ValueError:
                self.message_user(request, 'No hay suficientes sesiones para descontar.', level='error')

    # Definir descripciones para las acciones
    add_sessions_action.short_description = 'Añadir sesiones'
    deduct_sessions_action.short_description = 'Descontar sesiones'

class SessionAdmin(admin.ModelAdmin):
    list_display = ['get_clients', 'session_type', 'date', 'has_attended']
    list_filter = ['session_type', 'date']  # Remover attended_clients de list_filter
    search_fields = ['clients__name', 'clients__email']

    def get_clients(self, obj):
        return ", ".join([client.name for client in obj.clients.all()])
    get_clients.short_description = 'Clientes'

    def has_attended(self, obj):
        return ", ".join([client.name for client in obj.attended_clients.all()])
    has_attended.short_description = 'Clientes Asistentes'

class PackageAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'total_sessions']
    search_fields = ['name']

class SessionPackAdmin(admin.ModelAdmin):
    list_display = ['client', 'sessions_added', 'sessions_deducted', 'date', 'note']
    search_fields = ['client__name', 'note']
    list_filter = ['date']

admin.site.register(Client, ClientAdmin)
admin.site.register(Session, SessionAdmin)
admin.site.register(Package, PackageAdmin)
admin.site.register(SessionPack, SessionPackAdmin)
