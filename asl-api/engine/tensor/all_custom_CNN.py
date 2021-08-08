import torch
import torch.nn as nn
import torchvision

def mobileNetv2(classes, device):
    """
    Initialize CNN Mobile Net V2
    Parameters:
        classes (int): Number of image classes
    Returns:
        model (torchvision.model): Pretrained Mobile Net V2 model
    """
    # Creates torch computer vision model
    model = torchvision.models.mobilenet_v2(pretrained=True)

    # Freeze parameters of the trained network
    for param in model.parameters():
        param.requires_grad = False

    # Modify last layer to output specified number of image classes only
    model.classifier = nn.Sequential(nn.Dropout(p=0.6, inplace=False),
                                     nn.Linear(in_features=1280, out_features=classes, bias=True),
                                     nn.LogSoftmax(dim=1))

    # Unlock last three blocks before the last layer
    for param in model.features[-1].parameters():
        param.requires_grad = True

    # Set computation device
    model.to(device)

    return model


def resnet50(classes, device):
    """
    Initialize CNN ResNet 50
    Parameters:
        classes (int): Number of image classes
    Returns:
        model (torchvision.model): Pretrained ResNet 50
    """
    # Creates torch computer vision model
    model = torchvision.models.resnet50(pretrained=True)

    # Freeze parameters of the trained network
    for param in model.parameters():
        param.requires_grad = False

    # Modify last layer to output specified number of image classes only
    in_features = model.fc.in_features
    model.fc = torch.nn.Linear(in_features, classes)

    # Set computation device
    model.to(device)

    return model