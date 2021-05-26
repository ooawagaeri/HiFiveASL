from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from asgiref.sync import sync_to_async
import os


from .models import ASL, Predictor
from .serializers import ASLSerializer


# Async Delete oldest record
def del_oldest():
    obj = ASL.objects.first()
    image = getattr(obj, "image")
    os.remove(image.url[1:])
    obj.delete()


class ASLViewSet(viewsets.ViewSet):
    # GET ALL
    def list(self, request):
        asl = ASL.objects.all()
        asl_serializer = ASLSerializer(asl, many=True)
        return Response(asl_serializer.data)

    # POST
    def create(self, request):
        modified_request = Predictor.predict(request)
        asl_serializer = ASLSerializer(data=modified_request.data)
        if asl_serializer.is_valid():
            asl_serializer.save()

            sync_to_async(del_oldest(), thread_sensitive=True)

            return Response(asl_serializer.data, status=status.HTTP_201_CREATED)
        return Response(asl_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # GET
    def retrieve(self, request, pk=None):
        asl_queryset = ASL.objects.all()
        asl = get_object_or_404(asl_queryset, pk=pk)
        asl_serializer = ASLSerializer(asl)
        return Response(asl_serializer.data)
