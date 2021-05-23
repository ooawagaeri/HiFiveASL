from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response

from .models import ASL
from .serializers import ASLSerializer


class ASLViewSet(viewsets.ViewSet):
    # Get all
    def list(self, request):
        asl = ASL.objects.all()
        asl_serializer = ASLSerializer(asl, many=True)
        return Response(asl_serializer.data)

    # Post
    def create(self, request):
        asl_serializer = ASLSerializer(data=request.data)
        if asl_serializer.is_valid():
            asl_serializer.save()
            return Response(asl_serializer.data, status=status.HTTP_201_CREATED)
        return Response(asl_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Get individual
    def retrieve(self, request, pk=None):
        asl_queryset = ASL.objects.all()
        asl = get_object_or_404(asl_queryset, pk=pk)
        asl_serializer = ASLSerializer(asl)
        return Response(asl_serializer.data)