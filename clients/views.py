from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from .models import Client, Session, Package, SessionPack, \
        AttendanceLog
from .serializers import ClientSerializer, SessionSerializer, \
        PackageSerializer, SessionPackSerializer

# Create your views here.
class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

    @action(detail=True, methods=["post"])
    def assign_package(self, request, pk=None):
        client = self.get_object()
        package_id = request.data.get("package_id")
        try:
            package = Package.objects.get(id=package_id)
            client.available_credits += package.credits
            client.save()
            AttendanceLog.objects.create(
                client=client,
                action="add",
                slots=package.credits,
                description=f"Paquete: {package.name}",
            )
            return Response({"message": "Paquete asignado con éxito"}, status=status.HTTP_200_OK)
        except Package.DoesNotExist:
            return Response({"error": "Paquete no encontrado"}, status=status.HTTP_400_BAD_REQUEST)

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer

class SessionPackViewSet(viewsets.ModelViewSet):
    queryset = SessionPack.objects.all()
    serializer_class = SessionPackSerializer