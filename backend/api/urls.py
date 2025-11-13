from django.urls import path
from .views import FileUploadView,HistoryListView,DataSetDetailView,CustomAuthToken,GeneratePdfReportView,ChangePasswordView,RegisterView

urlpatterns = [
    # localhost:8000/api/upload/
    path('register/', RegisterView.as_view(), name='user-register'),

    path('login/',CustomAuthToken.as_view(),name='api-login'),
    path('change-password/',ChangePasswordView.as_view(),name='change-password'),
    path('upload/',FileUploadView.as_view(),name='file-upload'),
    path('history/', HistoryListView.as_view(), name='history-list'), 

    path('datasets/<int:pk>/',DataSetDetailView.as_view(),name='dataset-detail'),
    
    path('datasets/<int:pk>/report/',GeneratePdfReportView.as_view(),name='dataset-report')

]
