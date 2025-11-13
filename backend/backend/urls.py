from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse  

def api_root(request):
    return JsonResponse({
        'message': 'Welcome to the Chemical Visualizer API!',
        'api_endpoints': {
            'register':'/api/register/',
            'login': '/api/login/',
            'upload': '/api/upload/',
            'history': '/api/history/',
            'dataset_detail': '/api/datasets/<id>/'
        }
    })

urlpatterns = [
    path('', api_root),

    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]