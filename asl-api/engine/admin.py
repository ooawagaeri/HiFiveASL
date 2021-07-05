from django.contrib import admin
from .models import ASL, PractiseQuestion, PractiseAttempt, Gesture, QuizChoice, QuizAttempt

# Register your models here.
admin.site.register(ASL)
admin.site.register(PractiseQuestion)
admin.site.register(PractiseAttempt)
admin.site.register(Gesture)
admin.site.register(QuizChoice)
admin.site.register(QuizAttempt)
