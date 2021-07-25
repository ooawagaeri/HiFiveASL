"""
urls.py
URL Mapping between HTTP and Views
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls import url
from django.views.static import serve
from django.conf.urls.static import static

urlpatterns = [
    # Serve Admin dashboard
    path('admin/', admin.site.urls),
    # Serve API
    path('api/', include('engine.urls')),
    # Serve media images
    url(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT, })
]

# Read media folder images
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
