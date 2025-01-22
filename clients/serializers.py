from rest_framework import serializers
from .models import Client, Session, Package, AttendanceLog


class AttendanceLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceLog
        fields = ['action', 'slots', 'date', 'description']

class ClientSerializer(serializers.ModelSerializer):
    credit_logs = AttendanceLogSerializer(many=True, read_only=True)

    class Meta:
        model = Client
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'available_slots', 'credit_logs']

class SessionSerializer(serializers.ModelSerializer):
    clients = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Client.objects.all()
    )

    class Meta:
        model = Session
        fields = ['id', 'date', 'session_type', 'clients', 'attended_clients']

class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = ["id", "name", "slot_count"]
