from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls import url
from django.views.static import serve
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),  # Serve Admin dashboard
    path('api/', include('engine.urls')),  # Serve API
    url(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT, })  # Serve media images
]

# Read media folder images
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
