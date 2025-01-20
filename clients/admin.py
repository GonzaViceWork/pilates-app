from django.contrib import admin
from .models import Client, Session, Package, AttendanceLog

# Personalización de la interfaz del modelo Client
@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "email", "phone", "available_slots")
    search_fields = ("first_name", "last_name", "email")
    list_filter = ("available_slots",)
    ordering = ("last_name", "first_name")

# Personalización de la interfaz del modelo Session
@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ("date", "session_type", "get_clients")
    search_fields = ("date",)
    list_filter = ("session_type",)
    ordering = ("date",)

    def get_clients(self, obj):
        return ", ".join([f"{client.first_name} {client.last_name}" for client in obj.clients.all()])
    get_clients.short_description = "Clientes asignados"

# Personalización de la interfaz del modelo Package
@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ("name", "slot_count")
    search_fields = ("name",)
    ordering = ("slot_count",)

# Personalización de la interfaz del modelo AttendanceLog
@admin.register(AttendanceLog)
class AttendanceLogAdmin(admin.ModelAdmin):
    list_display = ("client", "action", "slots", "date")
    search_fields = ("client__first_name", "client__last_name", "action")
    list_filter = ("action", "date")
    ordering = ("date",)
