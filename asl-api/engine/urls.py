from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ASLViewSet, PractiseQuestionViewSet, UserPractiseViewSet, GestureViewSet


router = DefaultRouter()
router.register('asl', ASLViewSet, basename='asl')
router.register('practiseQns', PractiseQuestionViewSet, basename='practiseQns')
router.register('practiseUser', UserPractiseViewSet, basename='practiseUser')
router.register('gesture', GestureViewSet, basename='gesture')

urlpatterns = [
    path('', include(router.urls)),
]

