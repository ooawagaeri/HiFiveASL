"""
apps.py
Used to include application configuration for specified app
"""

from django.apps import AppConfig


class EngineConfig(AppConfig):
    """
    Configuration for Engine App
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'engine'
