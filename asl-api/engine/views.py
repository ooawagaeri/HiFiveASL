from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.response import Response
from asgiref.sync import sync_to_async
from .serializers import *
from django.db.models import Q


# Async delete oldest record
def del_oldest(request):
    count = request.count()
    # Keep to track
    if count >= 5:
        item = request.order_by('created_at')[0]
        item.delete()


class ASLViewSet(viewsets.ViewSet):
    # GET List
    @staticmethod
    def list(_):
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
            sync_to_async(del_oldest(ASL.objects), thread_sensitive=True)
            return Response(asl_serializer.data, status=status.HTTP_201_CREATED)
        return Response(asl_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # GET
    @staticmethod
    def retrieve(_, pk=None):
        asl_queryset = ASL.objects.all()
        asl = get_object_or_404(asl_queryset, pk=pk)
        asl_serializer = ASLSerializer(asl)
        return Response(asl_serializer.data)


class PractiseQuestionViewSet(viewsets.ModelViewSet):
    queryset = PractiseQuestion.objects.all()
    serializer_class = PractiseQuestionSerializer


class PractiseAttemptViewSet(viewsets.ModelViewSet):
    queryset = PractiseAttempt.objects.all()
    serializer_class = PractiseAttemptSerializer

    def create(self, request, **kwargs):
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


class QuizAttemptViewSet(viewsets.ModelViewSet):
    queryset = QuizAttempt.objects.all()
    serializer_class = QuizAttemptSerializer

    def create(self, request, **kwargs):
        # Delete oldest record
        sync_to_async(del_oldest(QuizAttempt.objects), thread_sensitive=True)
        return super().create(request)
