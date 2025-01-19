from django.db import models

# Create your models here.
class Client(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    total_sessions = models.PositiveIntegerField(default=0)
    used_sessions = models.PositiveIntegerField(default=0)

    def remaining_sessions(self):
        return self.total_sessions - self.used_sessions

    def __str__(self):
        return self.name
    
    def add_sessions(self, amount):
        self.total_sessions += amount
        self.save()
    
    def deduct_sessions(self, amount):
        if self.remaining_sessions() >= amount:
            self.used_sessions += amount
            self.save()
        else:
            raise ValueError("No se pueden descontar más sesiones de las disponibles.")  


class Package(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    total_sessions = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.name} - {self.price} ({self.total_sessions} sesiones)"


class Session(models.Model):
    SESSION_TYPE_CHOICES = [
        ('group', 'Grupal'),
        ('private', 'Privada'),
    ]

    session_type = models.CharField(
        max_length=10,
        choices=SESSION_TYPE_CHOICES,
        default='group',
    )
    clients = models.ManyToManyField(Client, related_name="sessions", blank=True)
    date = models.DateTimeField()
    attended = models.BooleanField(default=False)

    def __str__(self):
        clients_names = ", ".join([client.name for client in self.clients.all()])
        return f"{self.get_session_type_display()} - {clients_names} - {self.date.strftime('%Y-%m-%d %H:%M')}"


class SessionPack(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="session_packs")
    date = models.DateTimeField(auto_now_add=True)
    sessions_added = models.PositiveIntegerField(default=0)
    sessions_deducted = models.PositiveIntegerField(default=0)
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.client.name} - {self.sessions_added} added, {self.sessions_deducted} deducted on {self.date.strftime('%Y-%m-%d')}"