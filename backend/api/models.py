from django.db import models

# Create your models here.
class DataSet(models.Model):
    filename=models.CharField(max_length=255)
    uploaded_at=models.DateTimeField(auto_now_add=True)
    summary=models.JSONField()
    original_data=models.JSONField()
    
    def __str__(self):
        return f"{self.filename} ({self.uploaded_at.strftime('%Y-%m-%d %H:%M')})"
    
    class Meta:
        ordering=['-uploaded_at'] 