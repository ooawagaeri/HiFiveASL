from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ASLViewSet


router = DefaultRouter()
router.register('asl', ASLViewSet, basename='asl')

urlpatterns = [
    path('', include(router.urls)),
]
