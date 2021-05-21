from django.db import models

class ASL(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='post_images')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
