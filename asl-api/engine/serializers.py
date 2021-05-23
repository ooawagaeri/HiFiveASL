from rest_framework import serializers
from .models import ASL


class ASLSerializer(serializers.ModelSerializer):
    class Meta:
        model = ASL
        fields = '__all__'
