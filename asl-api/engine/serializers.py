from rest_framework import serializers
from .models import ASL


import albumentations
import cv2
import joblib
import numpy as np
import torch
from .tensor import custom_CNN
import os.path
import time


aug = albumentations.Compose([albumentations.Resize(224, 224, always_apply=True), ])
# Allocate computation device
device = 'cpu'

# Load label binarizer and model
lb = joblib.load('engine/tensor/output/lb_alpha.pkl')
model = custom_CNN.CustomCNN("engine/tensor/output/lb_alpha.pkl").to(device)
model.load_state_dict(torch.load('engine/tensor/output/model_alpha.pth', map_location=device))


class ASLSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = ASL
        fields = ('id', 'name', 'image', 'created_at')

    def get_name(self, obj):
        # Read image bytes into CV2
        nparr = np.fromstring(obj.image.read(), np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Load and prepare image
        image = aug(image=np.array(image))['image']
        image = np.transpose(image, (2, 0, 1)).astype(np.float32)
        image = torch.tensor(image, dtype=torch.float).to(device)
        image = image.unsqueeze(0)

        # Output
        outputs = model(image)
        _, prediction = torch.max(outputs.data, 1)
        answer = lb.classes_[prediction]
        if (answer == "nothing"):
            answer = ""

        return answer