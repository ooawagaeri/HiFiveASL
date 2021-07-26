"""
serializers.py
Used to converted and process query sets and model into JSON formats
"""

from rest_framework import serializers
from .tensor import custom_CNN
from .models import *

import albumentations
import cv2
import joblib
import numpy as np
import torch


def square_crop(img):
    """
    Crops given to 1:1 aspect ratio.
    Parameters:
        img (cv2.mat): Target image
    Returns:
        img (numpy.ndarray): Cropped image
    """
    # Retrieve height and width of target
    height, width, _ = img.shape

    # Exit if already 1:1
    if width == height:
        return img

    # Convert to numpy array
    img = np.array(img)

    # Offset to crop off
    offset = int(abs(height - width) / 2)

    # Crop horizontal side
    if width > height:
        img = img[:, offset:(width - offset), :]
    # Crop vertical side
    else:
        img = img[offset:(height - offset), :, :]

    return img


# Augmentation pipeline resize
aug = albumentations.Compose([
    albumentations.Resize(224, 224, always_apply=True),
])

# Allocate computation device
device = 'cpu'

# Load label binarizer and model
model_name = '_8000'
lb = joblib.load(f'engine/tensor/labels/lb_alpha{model_name}.pkl')
model = custom_CNN.CustomCNN(f"engine/tensor/labels/lb_alpha{model_name}.pkl").to(device)
model.load_state_dict(torch.load(f'engine/tensor/models/model_alpha{model_name}.pth',
                                 map_location=device))


class ASLSerializer(serializers.ModelSerializer):
    """
    ASL Serializer for processing translation request using ASL Model
    Methods:
        get_name(obj) (str): Translates current request's image into text when name is called
    """
    # Read-Only field, name
    name = serializers.SerializerMethodField()

    class Meta:
        """
        Meta binds object to a model and access specified fields
        """
        model = ASL
        fields = ('name', 'image', 'created_at')

    @staticmethod
    def get_name(obj):
        """
        Translates current request's image into text when name is called
        Parameters:
            obj (ASL): Target ASL request / object
        Returns:
            answer (str): Predicted text from image
        """
        # Read image bytes into cv2
        nparr = np.fromstring(obj.image.read(), np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Preprocess image in 1:1 and natural temperature
        image = square_crop(image)

        # Transform image into Tensor
        image = aug(image=np.array(image))['image']
        image = np.transpose(image, (2, 0, 1)).astype(np.float32)
        image = torch.tensor(image, dtype=torch.float).to(device)
        image = image.unsqueeze(0)

        # Predict image class
        outputs = model(image)
        _, prediction = torch.max(outputs.data, 1)
        answer = lb.classes_[prediction]

        # Close read image file
        obj.image.close()

        return answer


class PractiseQuestionSerializer(serializers.ModelSerializer):
    """
    Practise Question Serializer for processing question request using PractiseQuestion Model
    """
    class Meta:
        """
        Meta binds object to a model and access specified fields
        """
        model = PractiseQuestion
        fields = '__all__'


class PractiseAttemptSerializer(serializers.ModelSerializer):
    """
    Practise Attempt Serializer for processing practise request using PractiseAttempt Model
    """
    class Meta:
        """
        Meta binds object to a model and access specified fields
        """
        model = PractiseAttempt
        fields = ('id', 'response', 'practise_question', 'created_at',
                  'is_correct', 'wrong_letters')


class GestureSerializer(serializers.ModelSerializer):
    """
    Gesture Serializer for processing and accessing Gesture Model images
    """
    class Meta:
        """
        Meta binds object to a model and access specified fields
        """
        model = Gesture
        fields = '__all__'


class QuizChoiceSerializer(serializers.ModelSerializer):
    """
    Quiz Choice Serializer for processing MCQ request using QuizChoice Model
    """
    class Meta:
        """
        Meta binds object to a model and access specified fields
        """
        model = QuizChoice
        fields = ('id', 'question', 'question_name', 'choice', 'position',
                  'gestures')
