from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ASLViewSet, PractiseQuestionViewSet, PractiseAttemptViewSet, GestureViewSet,\
    QuizChoiceViewSet, QuizAttemptViewSet


router = DefaultRouter()
router.register('asl', ASLViewSet, basename='asl')
router.register('practiseQns', PractiseQuestionViewSet, basename='practiseQns')
router.register('practiseAns', PractiseAttemptViewSet, basename='practiseAns')
router.register('gesture', GestureViewSet, basename='gesture')
router.register('quizChoice', QuizChoiceViewSet, basename='quizChoice')
router.register('quizAttempt', QuizAttemptViewSet, basename='quizAttempt')

urlpatterns = [
    path('', include(router.urls)),
]

