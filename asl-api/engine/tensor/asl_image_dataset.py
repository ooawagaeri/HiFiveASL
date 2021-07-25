"""
asl_image_dataset.py
Used to augment dataset images in order to better CNN performance
"""

import albumentations
import cv2
import numpy as np
import torch
from torch.utils.data import Dataset


class ASLImageDataset(Dataset):
    """
    ASL Image Dataset reader and processor
    Attributes:
        x (str): Path of dataset image
        y (str): Data classification label
    Methods:
        __len__ (int): Size of paths
        __getitem__ (tensor): Returns image in tensor format
    """
    def __init__(self, path, labels):
        self.x = path
        self.y = labels
        # Augmentation pipeline resize
        self.aug = albumentations.Compose([
            albumentations.Resize(224, 224, always_apply=True),
        ])

    def __len__(self):
        return len(self.x)

    def __getitem__(self, i):
        # Read image
        image = cv2.imread(self.x[i])

        # Perform augmentation / transformation on image
        # Perform augmentation / transformation on image
        image = self.aug(image=np.array(image))['image']
        image = np.transpose(image, (2, 0, 1)).astype(np.float32)

        # Get label of image
        label = self.y[i]

        # Return tensor image
        return torch.tensor(image, dtype=torch.float), torch.tensor(label, dtype=torch.long)
