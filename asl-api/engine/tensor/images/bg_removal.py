"""
bg_removal.py
Background Remover Class
Used to remove the background of a given image
"""

from torchvision import models
from PIL import Image
import torch
import numpy as np
import cv2
import torchvision.transforms as T


def decode_segment_map(image, foreground, nc=21):
    """
    Segment Image Mapping
    Parameters:
        image (numpy.ndarray): Hand image data
        foreground (cv2.Mat): Hand image
        nc (int): Number of object types
    Returns:
        (cv2.Mat): Hand image with new bg
    """
    # RGB colouration for each object type
    label_colours = np.array([(0, 0, 0), (128, 0, 0), (0, 128, 0), (128, 128, 0), (0, 0, 128),
                              (128, 0, 128), (0, 128, 128), (128, 128, 128), (64, 0, 0),
                              (192, 0, 0), (64, 128, 0), (192, 128, 0), (64, 0, 128),
                              (192, 0, 128), (64, 128, 128), (192, 128, 128), (0, 64, 0),
                              (128, 64, 0), (0, 192, 0), (128, 192, 0), (0, 64, 128)])

    # 0=background, 1=aeroplane, 2=bicycle, 3=bird, 4=boat, 5=bottle, 6=bus, 7=car, 8=cat,
    # 9=chair, 10=cow, 11=dining table, 12=dog, 13=horse, 14=motorbike, 15=person, 16=potted plant,
    # 17=sheep, 18=sofa, 19=train, 20=tv/monitor

    # Initialize R,G,B from given image target
    r = np.zeros_like(image).astype(np.uint8)
    g = np.zeros_like(image).astype(np.uint8)
    b = np.zeros_like(image).astype(np.uint8)

    # Recolour each category to RGB colouration
    for label in range(0, nc):
        idx = image == label
        r[idx] = label_colours[label, 0]
        g[idx] = label_colours[label, 1]
        b[idx] = label_colours[label, 2]

    # Join R,G,B channels = colour segmented image
    rgb = np.stack([r, g, b], axis=2)

    # Change the colour of foreground image to RGB
    # and resize image to match shape of R-band in RGB output map
    foreground = cv2.cvtColor(foreground, cv2.COLOR_BGR2RGB)
    foreground = cv2.resize(foreground, (r.shape[1], r.shape[0]))

    # Create white pixel background array with the same size as RGB output map
    background = 255 * np.ones_like(rgb).astype(np.uint8)

    # Convert int to float
    foreground = foreground.astype(float)
    background = background.astype(float)

    # Binary mask of the RGB output map using the threshold value 0
    _, alpha = cv2.threshold(np.array(rgb), 0, 255, cv2.THRESH_BINARY)

    # Soften edges using blur
    alpha = cv2.GaussianBlur(alpha, (7, 7), 0)

    # Normalize the mask
    alpha = alpha.astype(float) / 255

    # Multiply the foreground with the alpha matte
    foreground = cv2.multiply(alpha, foreground)

    # Multiply the background with ( 1 - alpha )
    background = cv2.multiply(1.0 - alpha, background)

    # Add the masked foreground and background
    return cv2.add(foreground, background)


def prepare_segment(net, source, dev='cuda'):
    """
    Prepares target image before foreground and background separation
    Parameters:
        net (pytorch_vision.model): Segmentation Model
        source (cv2.Mat): Hand image
        dev (str): Computation device, default GPU
    Returns:
        (cv2.Mat): Hand image with new bg
    """
    # CV2 to PIL Image
    img = cv2.cvtColor(source, cv2.COLOR_BGR2RGB)
    img = Image.fromarray(img)

    # Standardized image size & normalize for better inference
    transformer = T.Compose([T.Resize(400),
                             T.ToTensor(),
                             T.Normalize(mean=[0.485, 0.456, 0.406],
                                         std=[0.229, 0.224, 0.225])
                             ])

    img_transformed = transformer(img).unsqueeze(0).to(dev)

    # Copy data image into computation device memory
    img_model = net.to(dev)(img_transformed)['out']

    # Compute using CPU tensor convert torch tensor to numpy array
    img_tensor = torch.argmax(img_model.squeeze(), dim=0).detach().cpu().numpy()

    return decode_segment_map(img_tensor, source)


class BgRemover:
    """
    Background Remover Class Function
    Attributes:
        deeplab : pytorch_vision.model
    Methods:
        run(self, img, bg): Changes background of a given image with new background.
    """
    def __init__(self):
        """
        Constructs BgRemover object.
        Pre-trained vision model for object separation
        """
        self.deeplab = models.segmentation.deeplabv3_resnet101(pretrained=True).eval()

    def run(self, img):
        """
        Changes background of a given image with new background.
        Parameters:
            img (cv2.Mat): Hand image
        Returns:
            (cv2.Mat): Hand image with new bg
        """
        return prepare_segment(self.deeplab, img)
