from rest_framework import serializers
from .models import Client, Session, Package, SessionPack

class ClientSerializer(serializers.ModelSerializer):
    remaining_sessions = serializers.ReadOnlyField()

    class Meta:
        model = Client
        fields = ['id', 'name', 'email', 'phone', 'total_sessions', 'used_sessions', 'remaining_sessions']

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
        fields = ['id', 'name', 'description', 'price', 'total_sessions']

class SessionPackSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionPack
        fields = ['id', 'client', 'date', 'sessions_added', 'sessions_deducted', 'note']