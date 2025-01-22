from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from .models import Client, Session, Package, \
        AttendanceLog
from .serializers import ClientSerializer, SessionSerializer, \
        PackageSerializer

# Create your views here.
class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

    @action(detail=True, methods=["post"], url_path="assign_package")
    def assign_package(self, request, pk=None):
        client = self.get_object()
        package_id = request.data.get("package_id")

        if not package_id:
            return Response({"error": "Debe proporcionar un paquete."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            package = Package.objects.get(id=package_id)
        except Package.DoesNotExist:
            return Response({"error": "Paquete no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Actualizar los cupos del cliente
        client.available_slots += package.slot_count
        client.save()

        # Crear un registro en AttendanceLog
        AttendanceLog.objects.create(
            client=client,
            action="add",
            slots=package.slot_count,
            description=package.name,
        )

        return Response({"message": "Paquete asignado correctamente."}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=["get"], url_path="attendance_logs")
    def attendance_logs(self, request, pk=None):
        client = self.get_object()
        logs = client.attendance_logs.all()  # Obtiene todos los AttendanceLogs del cliente
        # Serializa los datos
        serialized_logs = [
            {
                "action": log.action,
                "slots": log.slots,
                "description": log.description,
                "date": log.date,
            }
            for log in logs
        ]
        return Response(serialized_logs)

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

    def create(self, request, *args, **kwargs):
        # Aquí puedes hacer validaciones o ajustes si es necesario
        return super().create(request, *args, **kwargs)

class PackageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer


