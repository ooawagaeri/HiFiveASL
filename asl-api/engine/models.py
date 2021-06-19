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


class PractiseAnswer(models.Model):
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
