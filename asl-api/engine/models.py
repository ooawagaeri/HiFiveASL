"""
models.py
Used to define, access and manage data using objects, a.k.a models.
"""

from django.db.models import Q
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from .validators import validate_choices


class ASL(models.Model):
    """
    ASL Model for translating image to string
    Attributes:
        self.name (str): Translated letter of image
        self.image (str): Path to image file
        self.created_at (str): DateTime of object creation
    """
    name = models.CharField(max_length=10, blank=True)
    image = models.ImageField(upload_to='post_images')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class PractiseQuestion(models.Model):
    """
    Question Model for all possible questions for practises and quizzes
    Attributes:
        self.answer (str): Answer to the question
    """
    answer = models.CharField(max_length=10)

    def __str__(self):
        return self.answer


class PractiseAttempt(models.Model):
    """
    Practise Attempt Model to track all attempts / tries made by client
    Attributes:
        self.response (str): Answer to the question
        self.practise_question (int): Foreign key referencing to question
        self.created_at (str): DateTime of object creation
    """
    response = models.CharField(max_length=10)
    practise_question = models.ForeignKey(PractiseQuestion, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_correct(self):
        """
        Checks if given response is correct with answer
        Returns:
            (bool): If response is same as answer
        """
        return self.practise_question.answer == self.response

    @property
    def wrong_letters(self):
        """
        Retrieves all letters which were wrong
        Returns:
            wrongs ([str]): List of wrong letters
        """
        rep = self.response
        ans = self.practise_question.answer

        wrongs = []
        for index in range(0, len(ans)):
            if rep[index] != ans[index]:
                wrongs.append(ans[index])

        return wrongs


class Gesture(models.Model):
    """
    Gesture Model stores corresponding letter to an ASL image
    Attributes:
        self.name (str): ASL letter of image
        self.image (str): Path to image file
    """
    name = models.CharField(max_length=10)
    image = models.ImageField(upload_to='get_images')

    def __str__(self):
        return self.name


class QuizChoice(models.Model):
    """
    Gesture Model stores corresponding letter to an ASL image
    Attributes:
        self.question (int): Foreign key referencing to question
        self.choice (str): String of MCQ options separated by commas
        self.position (int): Index position of the correct answer
    """
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
        """
        Retrieves list ASL images of question
        Returns:
            queryset ([str]): List of path to ASL image
        """
        ans = self.question.answer
        queryset = Gesture.objects.all().order_by('name')

        # Combine individual letter queries into single query
        query = Q()
        for char in ans:
            query = query | Q(name=char)

        # Retrieve name and image path of query
        queryset = queryset.filter(query).values('name', 'image')

        return list(queryset)

    @property
    def question_name(self):
        """
        Retrieves question name / answer
        """
        return self.question.answer
