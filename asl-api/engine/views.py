"""
views.py
Used to receive web request and return web responses.
"""

from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.response import Response
from asgiref.sync import sync_to_async
from .serializers import *
from django.db.models import Q


def del_oldest(request):
    """
    Deletes the oldest record from database
    Parameters:
        request (django.QuerySets): Database queryset of target model
    """
    # Retrieve size of database records
    count = request.count()
    # Keep to track
    if count >= 5:
        item = request.order_by('created_at')[0]
        item.delete()


class ASLViewSet(viewsets.ViewSet):
    """
    REST HTTP view for ASL Model
    Methods:
        list(_): Lists all ASL records
        create(request): Creates new ASL record
        retrieve(_, pk): Retrieves individual ASL record based on key
    """
    @staticmethod
    def list(_):
        """
        Retrieves list of ASL records / objects
        Parameters:
            _ (rest_framework.request.Request): HTTP request from client
        Returns:
            (rest_framework.response.HttpResponse): HTTP response to client
        """
        asl = ASL.objects.all()
        asl_serializer = ASLSerializer(asl, many=True)
        return Response(asl_serializer.data)

    # POST
    @staticmethod
    def create(request):
        """
        Creates a ASL record / object
        Parameters:
            request (rest_framework.request.Request): HTTP request from client
        Returns:
            (rest_framework.response.HttpResponse): HTTP response to client
        """
        asl_serializer = ASLSerializer(data=request.data)
        if asl_serializer.is_valid():
            # Save ASL record
            asl_serializer.save()

            # Delete oldest record
            sync_to_async(del_oldest(ASL.objects), thread_sensitive=True)

            return Response(asl_serializer.data, status=status.HTTP_201_CREATED)
        return Response(asl_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # GET
    @staticmethod
    def retrieve(_, pk=None):
        """
        Creates a ASL record / object
        Parameters:
            _ (rest_framework.request.Request): HTTP request from client
            pk (int): Primary key of target record
        Returns:
            (rest_framework.response.HttpResponse): HTTP response to client
        """
        asl_queryset = ASL.objects.all()

        # Query individual object
        asl = get_object_or_404(asl_queryset, pk=pk)

        asl_serializer = ASLSerializer(asl)
        return Response(asl_serializer.data)


class PractiseQuestionViewSet(viewsets.ModelViewSet):
    """
    REST HTTP view for Practise Question Model
    """
    queryset = PractiseQuestion.objects.all()
    serializer_class = PractiseQuestionSerializer


class PractiseAttemptViewSet(viewsets.ModelViewSet):
    """
    REST HTTP view for Practise Attempt  Model
    """
    queryset = PractiseAttempt.objects.all()
    serializer_class = PractiseAttemptSerializer

    def create(self, request, **kwargs):
        """
        Creates a Practise Attempt record / object
        Parameters:
            request (rest_framework.request.Request): HTTP request from client
            kwargs (int): Primary key of target record
        Returns:
            (rest_framework.response.HttpResponse): HTTP response to client
        """
        # Delete oldest record
        sync_to_async(del_oldest(PractiseAttempt.objects), thread_sensitive=True)
        return super().create(request)


class GestureViewSet(viewsets.ModelViewSet):
    serializer_class = GestureSerializer

    # GET Search
    def get_queryset(self):
        queryset = Gesture.objects.all().order_by('name')
        search = self.request.GET.get('search', '').upper()

        if search:
            characters = list(search)
            query = Q()
            for char in characters:
                query = query | Q(name=char)
            queryset = queryset.filter(query)
        return queryset


class QuizChoiceViewSet(viewsets.ModelViewSet):
    queryset = QuizChoice.objects.all()
    serializer_class = QuizChoiceSerializer
