from django.db import models

# Create your models here.
class Client(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    available_slots = models.PositiveIntegerField(default=0)  # Cupos disponibles

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class AttendanceLog(models.Model):
    ACTION_TYPES = [
        ("add", "Paquete Asignado"),
        ("deduct", "Clase Asistida"),
    ]
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="attendance_logs")
    action = models.CharField(max_length=10, choices=ACTION_TYPES)  # "Paquete asignado" o "Clase asistida"
    slots = models.IntegerField()  # Positivo o negativo
    date = models.DateTimeField(auto_now_add=True)  # Fecha y hora del cambio
    description = models.TextField(blank=True)  # Nombre del paquete o clase asistida

    def __str__(self):
        return f"{self.client} - {self.action} ({self.slots})"


class Package(models.Model):
    name = models.CharField(max_length=100)
    slot_count = models.PositiveIntegerField()

    def __str__(self):
        return self.name


class Session(models.Model):
    SESSION_TYPES = [
        ('group', 'Grupal'),
        ('private', 'Privada'),
    ]

    clients = models.ManyToManyField(Client, related_name="sessions")
    date = models.DateTimeField()
    session_type = models.CharField(max_length=10, choices=SESSION_TYPES, default='group')
    attended_clients = models.ManyToManyField(Client, related_name="attended_sessions", blank=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Registrar asistencia y descontar cupos
        for client in self.attended_clients.all():
            if client.available_credits > 0:
                client.available_credits -= 1
                client.save()
                AttendanceLog.objects.create(
                    client=client,
                    action="deduct",
                    slots=-1,
                    description=f"Sesión {self.get_session_type_display()} - {self.date}",
                )

    def __str__(self):
        return f"{self.get_session_type_display()} - {self.date.strftime('%Y-%m-%d %H:%M')}"


class SessionPack(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="session_packs")
    date = models.DateTimeField(auto_now_add=True)
    sessions_added = models.PositiveIntegerField(default=0)
    sessions_deducted = models.PositiveIntegerField(default=0)
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.client.name} - {self.sessions_added} added, {self.sessions_deducted} deducted on {self.date.strftime('%Y-%m-%d')}"