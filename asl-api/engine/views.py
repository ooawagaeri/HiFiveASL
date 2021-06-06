from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets, filters
from rest_framework.response import Response
from asgiref.sync import sync_to_async
import os

from .models import ASL, PractiseQuestion, UserPractise, Gesture
from .serializers import ASLSerializer, PractiseQuestionSerializer, UserPractiseSerializer, GestureSerializer


# Async Delete oldest record
def del_oldest():
    obj = ASL.objects.first()
    image = getattr(obj, "image")
    os.remove(image.url[1:])
    obj.delete()


class ASLViewSet(viewsets.ViewSet):
    # GET (LIST)
    def list(self, request):
        asl = ASL.objects.all()
        asl_serializer = ASLSerializer(asl, many=True)
        return Response(asl_serializer.data)

    # POST
    def create(self, request):
        asl_serializer = ASLSerializer(data=request.data)
        if asl_serializer.is_valid():
            asl_serializer.save()

            # Delete oldest record
            sync_to_async(del_oldest(), thread_sensitive=True)

            return Response(asl_serializer.data, status=status.HTTP_201_CREATED)
        return Response(asl_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # GET
    def retrieve(self, request, pk=None):
        asl_queryset = ASL.objects.all()
        asl = get_object_or_404(asl_queryset, pk=pk)
        asl_serializer = ASLSerializer(asl)
        return Response(asl_serializer.data)


class PractiseQuestionViewSet(viewsets.ModelViewSet):
    queryset = PractiseQuestion.objects.all()
    serializer_class = PractiseQuestionSerializer


class UserPractiseViewSet(viewsets.ModelViewSet):
    queryset = UserPractise.objects.all()
    serializer_class = UserPractiseSerializer


class GestureViewSet(viewsets.ModelViewSet):
    search_fields = ['name']
    filter_backends = (filters.SearchFilter,)
    queryset = Gesture.objects.all()
    serializer_class = GestureSerializer
