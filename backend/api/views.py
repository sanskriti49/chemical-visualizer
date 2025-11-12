from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView,UpdateAPIView
from rest_framework.response import Response
from rest_framework import status
import pandas as pd
from .models import DataSet
from .serializers import DataSetSerializer,ChangePasswordSerializer

from django.contrib.auth import get_user_model
from django.http import HttpResponse
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
import io


class CustomAuthToken(ObtainAuthToken):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })

class ChangePasswordView(UpdateAPIView):
    serializer_class=ChangePasswordSerializer
    model=get_user_model()
    permission_classes=(IsAuthenticated,)
    
    def get_object(self,queryset=None):
        return self.request.user
    
    def update(self,request,*args,**kwargs):
        self.object=self.get_object()
        serializer=self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            # check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password":["Wrong password"]}, status=status.HTTP_400_BAD_REQUEST)
            
            # set the new password
            self.object.set_password(serializer.data.get("new_password1"))
            self.object.save()
            
            response={
                'status':'success',
                'code':status.HTTP_200_OK,
                'message':'Password updated successfully',
                'data':[]
            }
            
            return Response(response)     
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        csv_file = request.FILES.get('file')
        if not csv_file or not csv_file.name.endswith('.csv'):
            return Response({"error": "A .csv file is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            df = pd.read_csv(csv_file)
            summary = {
                'total_count': len(df),
                'avg_flowrate': df['Flowrate'].mean(),
                'avg_pressure': df['Pressure'].mean(),
                'avg_temperature': df['Temperature'].mean(),
                'equipment_type_distribution': df['Type'].value_counts().to_dict()
            }
            
            dataset = DataSet.objects.create(
                filename=csv_file.name,
                summary=summary,
                original_data=df.to_dict('records')
            )
            
            all_datasets = DataSet.objects.order_by('-uploaded_at')
            if all_datasets.count() > 5:
                pks_to_delete = all_datasets.values_list('pk', flat=True)[5:]
                DataSet.objects.filter(pk__in=list(pks_to_delete)).delete()

            serializer = DataSetSerializer(dataset)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except KeyError as e:
            return Response({"error": f"Missing column in CSV file: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class HistoryListView(ListAPIView):
    queryset = DataSet.objects.all().order_by('-uploaded_at')
    serializer_class = DataSetSerializer
    
class DataSetDetailView(RetrieveAPIView):
    queryset = DataSet.objects.all()
    serializer_class = DataSetSerializer

class GeneratePdfReportView(APIView):
    def get(self, request, pk, *args, **kwargs):
        try:
            dataset = DataSet.objects.get(pk=pk)
        except DataSet.DoesNotExist:
            return Response({"error": "Dataset not found"}, status=status.HTTP_404_NOT_FOUND)

        buffer = io.BytesIO()

        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        p.setFont("Helvetica-Bold", 16)
        p.drawString(inch, height - inch, f"Analysis Report for: {dataset.filename}")

        p.setFont("Helvetica", 12)
        p.drawString(inch, height - 1.5*inch, "Summary Statistics")
        
        summary = dataset.summary
        y_pos = height - 2*inch
        for key, value in summary.items():
            # A more robust way to handle nested dictionaries and other types
            if key == 'equipment_type_distribution':
                 p.drawString(1.2*inch, y_pos, f"{key.replace('_', ' ').title()}:")
                 y_pos -= 0.25*inch
                 for sub_key, sub_value in value.items():
                     p.drawString(1.4*inch, y_pos, f"- {sub_key}: {sub_value}")
                     y_pos -= 0.25*inch
            else:
                 p.drawString(1.2*inch, y_pos, f"{key.replace('_', ' ').title()}: {value:.2f}" if isinstance(value, float) else f"{key.replace('_', ' ').title()}: {value}")
                 y_pos -= 0.25*inch

        p.showPage()
        p.save()

        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="report_{dataset.id}.pdf"'
        return response