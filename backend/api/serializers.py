from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import DataSet

class DataSetSerializer(serializers.ModelSerializer):
    class Meta:
        model=DataSet
        fields=['id','filename','uploaded_at','summary','original_data']
        
class ChangePasswordSerializer(serializers.Serializer):
    old_password=serializers.CharField(required=True)
    new_password1=serializers.CharField(required=True)
    new_password2=serializers.CharField(required=True)
    
    def validate(self, data):
        if data['new_password1']!=data['new_password2']:
            raise serializers.ValidationError({"new_password2":"New passwords must match"})
        return data
    
    def validate_old_password(self,value):
        user=self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError({"old_password":"Old password is not correct"})
        
        return value
    
    def save(self,**kwargs):
        password=self.validated_data['new_password1']
        user=self.context['request'].user
        user.set_password(password)
        user.save()
        return user