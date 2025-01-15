from django.shortcuts import render
from rest_framework import viewsets
from .models import Client, Session
from .serializers import ClientSerializer, SessionSerializer

# Create your views here.
class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer