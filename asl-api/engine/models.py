from django.db.models import Q
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from .validators import validate_choices


class ASL(models.Model):
    name = models.CharField(max_length=10, blank=True)
    image = models.ImageField(upload_to='post_images')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class PractiseQuestion(models.Model):
    answer = models.CharField(max_length=10)

    def __str__(self):
        return self.answer


class PractiseAttempt(models.Model):
    response = models.CharField(max_length=10)
    practise_question = models.ForeignKey(PractiseQuestion, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_correct(self):
        return self.practise_question.answer == self.response

    @property
    def wrong_letters(self):
        rep = self.response
        ans = self.practise_question.answer

        wrongs = []
        for index in range(0, len(ans)):
            if rep[index] != ans[index]:
                wrongs.append(ans[index])

        return wrongs


class Gesture(models.Model):
    name = models.CharField(max_length=10)
    image = models.ImageField(upload_to='get_images')

    def __str__(self):
        return self.name


class QuizChoice(models.Model):
    question = models.ForeignKey("PractiseQuestion", related_name="choices",
                                 on_delete=models.PROTECT)
    choice = models.CharField("QuizChoice",
                              max_length=200,
                              validators=[validate_choices])
    position = models.IntegerField(
        validators=[
            # 4 Choices MCQ
            MaxValueValidator(3),
            MinValueValidator(0)
        ])

    @property
    def gestures(self):
        ans = self.question.answer
        queryset = Gesture.objects.all().order_by('name')
        query = Q()
        for char in ans:
            query = query | Q(name=char)
        queryset = queryset.filter(query).values('name', 'image')
        return list(queryset)

    @property
    def question_name(self):
        return self.question.answer


class QuizAttempt(models.Model):
    response = models.IntegerField(
        validators=[
            # 4 Choices MCQ
            MaxValueValidator(3),
            MinValueValidator(0)
        ])
    quiz = models.ForeignKey(QuizChoice, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_correct(self):
        return self.quiz.position == self.response
