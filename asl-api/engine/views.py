from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets, filters
from rest_framework.response import Response
from asgiref.sync import sync_to_async

from .models import ASL, PractiseQuestion, UserPractise, Gesture
from .serializers import ASLSerializer, PractiseQuestionSerializer, UserPractiseSerializer, GestureSerializer
import nltk
from nltk.corpus import wordnet


# Download latest word dictionary (for word check)
nltk.download('wordnet', quiet=True)


# Async Delete oldest record
def del_oldest_asl():
    count = ASL.objects.count()
    # Keep to track
    if count > 5:
        obj = ASL.objects.order_by('created_at')[0]
        obj.delete()


# Async Delete oldest record
def del_oldest_practise():
    count = UserPractise.objects.count()
    # Keep to track
    if count > 5:
        obj = UserPractise.objects.order_by('created_at')[0]
        obj.delete()


class ASLViewSet(viewsets.ViewSet):
    # GET List
    @staticmethod
    def list(request):
        asl = ASL.objects.all()
        asl_serializer = ASLSerializer(asl, many=True)
        return Response(asl_serializer.data)

    # POST
    @staticmethod
    def create(request):
        asl_serializer = ASLSerializer(data=request.data)
        if asl_serializer.is_valid():
            asl_serializer.save()
            # Delete oldest record
            sync_to_async(del_oldest_asl(), thread_sensitive=True)
            return Response(asl_serializer.data, status=status.HTTP_201_CREATED)
        return Response(asl_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # GET
    @staticmethod
    def retrieve(request, pk=None):
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

    def create(self, request, **kwargs):
        # Delete oldest record
        sync_to_async(del_oldest_practise(), thread_sensitive=True)
        return super().create(request)


class GestureViewSet(viewsets.ModelViewSet):
    serializer_class = GestureSerializer

    # GET Search
    def get_queryset(self):
        queryset = Gesture.objects.all().order_by('name')
        search = self.request.GET.get('search', '').upper()

        if search:
            if not wordnet.synsets(search):
                return []

            characters = list(search)
            query = Q()
            for char in characters:
                query = query | Q(name=char)
            queryset = queryset.filter(query)
        return queryset
