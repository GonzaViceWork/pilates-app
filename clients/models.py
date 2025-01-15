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


class Session(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="sessions")
    date = models.DateTimeField()
    attended = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.client.name} - {self.date.strftime('%Y-%m-%d %H:%M')}"