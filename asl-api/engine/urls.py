from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ASLViewSet, PractiseQuestionViewSet, PractiseAnswerViewSet, GestureViewSet


router = DefaultRouter()
router.register('asl', ASLViewSet, basename='asl')
router.register('practiseQns', PractiseQuestionViewSet, basename='practiseQns')
router.register('practiseAns', PractiseAnswerViewSet, basename='practiseAns')
router.register('gesture', GestureViewSet, basename='gesture')

urlpatterns = [
    path('', include(router.urls)),
]

