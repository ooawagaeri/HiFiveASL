"""
admin.py
Used to load and display models in the Django's admin page
"""

from django.contrib import admin
from .models import ASL, PractiseQuestion, PractiseAttempt, Gesture, QuizChoice

# Registered models
admin.site.register(ASL)
admin.site.register(PractiseQuestion)
admin.site.register(PractiseAttempt)
admin.site.register(Gesture)
admin.site.register(QuizChoice)
