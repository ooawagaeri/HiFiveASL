"""
asgi.py
ASGI config for asl-api project.
Exposes the ASGI callable as a module-level variable named ``application``.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'asl-api.settings')

application = get_asgi_application()
