from django.db import models

# import albumentations
# import cv2
# import joblib
# import numpy as np
# import torch
# from .tensor import custom_CNN


class ASL(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='post_images')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# class Predictor():
#     aug = albumentations.Compose([albumentations.Resize(224, 224, always_apply=True),])
#
#     # Load label binarizer and model
#     lb = joblib.load('output/lb_alpha.pkl')
#     model = custom_CNN.CustomCNN().cuda()
#     model.load_state_dict(torch.load('output/model_alpha.pth'))
#
#     def predict(self, request):
#         temp_request_data = request.data.copy()
#         image = cv2.imread(f"..{temp_request_data['image']}")
#
#         # Load and prepare image
#         image = self.aug(image=np.array(image))['image']
#         image = np.transpose(image, (2, 0, 1)).astype(np.float32)
#         image = torch.tensor(image, dtype=torch.float).cuda()
#         image = image.unsqueeze(0)
#
#         # Output
#         outputs = self.model(image)
#         _, prediction = torch.max(outputs.data, 1)
#
#         temp_request_data["name"] = self.lb.classes_[prediction]
#         return temp_request_data