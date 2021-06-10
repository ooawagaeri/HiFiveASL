from django.db import models


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


class UserPractise(models.Model):
    response = models.CharField(max_length=10)
    practise_question = models.ForeignKey(PractiseQuestion, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_correct(self):
        return self.practise_question.answer == self.response


class Gesture(models.Model):
    name = models.CharField(max_length=10)
    image = models.ImageField(upload_to='get_images')

    def __str__(self):
        return self.name
