from rest_framework import serializers
from .models import Client, Session

class ClientSerializer(serializers.ModelSerializer):
    remaining_sessions = serializers.ReadOnlyField()

    class Meta:
        model = Client
        fields = '__all__'

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = '__all__'