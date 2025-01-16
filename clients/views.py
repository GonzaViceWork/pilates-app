from django.shortcuts import render
from rest_framework import viewsets
from .models import Client, Session, Package
from .serializers import ClientSerializer, SessionSerializer, PackageSerializer

# Create your views here.
class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
