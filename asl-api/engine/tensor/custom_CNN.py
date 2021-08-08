"""
custom_CNN.py
Used to perform / extract features from img via convolution operation(s)
"""

import torch.nn as nn
import torch.nn.functional as func
import joblib
import os


class CustomCNN(nn.Module):
    """
    Custom convolution neural network class
    Attributes:
        conv1 : torch.Conv2d
        conv2 : torch.Conv2d
        conv3 : torch.Conv2d
        conv4 : torch.Conv2d
        fc1 : torch.Linear
        fc2 : torch.Linear
        pool : torch.MaxPool2d
    Methods:
        forward(self, x): Feeds images through several layer aka Feed-Forward network
    """
    def __init__(self, lb_len):
        """
        Constructs CustomCNN object.
        """
        super(CustomCNN, self).__init__()
        # Computes a 2-D convolution
        self.conv1 = nn.Conv2d(3, 16, 5)
        self.conv2 = nn.Conv2d(16, 32, 5)
        self.conv3 = nn.Conv2d(32, 64, 3)
        self.conv4 = nn.Conv2d(64, 128, 5)

        # Performs linear transformation on data
        self.fc1 = nn.Linear(128, 256)
        self.fc2 = nn.Linear(256, lb_len)

        # Applies 2D max_images pooling over img
        # Calculates maximum value in each patch of the feature map and
        # down-samples img, reducing dimensionality / parameters for
        # better assumptions / predictions
        self.pool = nn.MaxPool2d(2, 2)

    def forward(self, x):
        """
        Feeds images through several layer aka Feed-Forward network
        Parameters:
            x (torch.Tensor) : Input tensor
        Returns:
            x (torch.Tensor) : Output tensor
        """
        # Applies the rectified linear unit function element-wise
        x = self.pool(func.relu(self.conv1(x)))
        x = self.pool(func.relu(self.conv2(x)))
        x = self.pool(func.relu(self.conv3(x)))
        x = self.pool(func.relu(self.conv4(x)))
        bs, _, _, _ = x.shape
        # Applies a 2D adaptive average pooling over an img signal
        # composed of several img planes.
        x = func.adaptive_avg_pool2d(x, 1).reshape(bs, -1)
        x = func.relu(self.fc1(x))
        x = self.fc2(x)
        return x
