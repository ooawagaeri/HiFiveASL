from django.urls import path
from . import views

urlpatterns = [
    path('engine/', views.ASLView.as_view(), name='engine_list'),
]
