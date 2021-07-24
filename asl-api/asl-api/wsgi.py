"""
wsgi.py
WSGI config for asl-api project.
Exposes the WSGI callable as a module-level variable named ``application``.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'asl-api.settings')

application = get_wsgi_application()
