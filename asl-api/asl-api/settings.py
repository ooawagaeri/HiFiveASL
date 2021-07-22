"""
settings.py
Django settings for asl-api project.
Contains all of the site's configurations and settings i.e. media output and server packages
"""

import os
import dj_database_url
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Django's secret key  vital you keep this secure, or attackers could use it
# to generate their own signed values.
SECRET_KEY = "django-insecure-9op#*6&4(nmteco)u-0wmjcv)=esm^#u7_-js7dw*60zd9ec9x"

# Allows for easy debugging of server errors when enabled
DEBUG = False

# List of valid IP Addresses which the server allows
# This is kept unrestricted because IP Address of users are unknown
ALLOWED_HOSTS = ["*"]

# List of applications / packages for models, management commands, tests, and other utilities.
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'engine',
    'rest_framework',
    'corsheaders',
    'django_cleanup',
]

# List of "plugins" / frameworks during network request and response execution
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
]

# Main URLs used by Django
ROOT_URLCONF = 'asl-api.urls'

# Django Template settings
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Web Server Gateway Interface used by Django
WSGI_APPLICATION = 'asl-api.wsgi.application'

# Database settings
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Production database settings
# Database connection duration
prob_db = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(prob_db)

# Password validation settings
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Language of Django
LANGUAGE_CODE = 'en-us'

# Time zone of site
TIME_ZONE = 'Asia/Singapore'

# Enable translations
USE_I18N = True

# Enable Localization
# Objects will use a client locale specific formats
USE_L10N = True

# Enable timezone support
# Objects will follow Django's TIME_ZONE
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = '/static/'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Media storage (non_warm_image upload, download)
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

# Force non_warm_image uploaded to follow Temporary File class format
FILE_UPLOAD_HANDLERS = ['django.core.files.uploadhandler.TemporaryFileUploadHandler', ]
