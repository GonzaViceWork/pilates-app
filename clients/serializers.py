from rest_framework import serializers
from .models import Client, Session, Package

class ClientSerializer(serializers.ModelSerializer):
    remaining_sessions = serializers.ReadOnlyField()

    class Meta:
        model = Client
        fields = ['id', 'name', 'email', 'phone', 'total_sessions', 'used_sessions', 'remaining_sessions']

class SessionSerializer(serializers.ModelSerializer):
    clients = ClientSerializer(many=True, read_only=True)
    session_type_display = serializers.CharField(source='get_session_type_display', read_only=True)

    class Meta:
        model = Session
        fields = ['id', 'session_type', 'session_type_display', 'clients', 'date', 'attended']


class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = ['id', 'name', 'description', 'price', 'total_sessions']