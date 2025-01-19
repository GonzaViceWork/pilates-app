"""
URL configuration for pilates_app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from clients.views import ClientViewSet, SessionViewSet, PackageViewSet, SessionPackViewSet

router = DefaultRouter()
router.register(r'clients', ClientViewSet)
router.register(r'sessions', SessionViewSet)
router.register(r'packages', PackageViewSet)
router.register(r'session_packs', SessionPackViewSet)

urlpatterns = [
    path('api/', include(router.urls)),  # Rutas de la API
    path('admin/', admin.site.urls),  # Panel de administración
]
