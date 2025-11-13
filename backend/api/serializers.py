from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import DataSet

User = get_user_model()

class DataSetSerializer(serializers.ModelSerializer):
    class Meta:
        model=DataSet
        fields=['id','filename','uploaded_at','summary','original_data']
        
class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new user.
    """
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        """
        Check that the two password entries match.
        """
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return data

    def create(self, validated_data):
        """
        Create and return a new user with a hashed password.
        """
        validated_data.pop('password2')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user    
    
class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password1 = serializers.CharField(required=True)
    new_password2 = serializers.CharField(required=True)

    def validate(self, data):
        user = self.context['request'].user

        if not user.check_password(data.get('old_password')):
            raise serializers.ValidationError({'old_password': 'Wrong password.'})

        if data.get('new_password1') != data.get('new_password2'):
            raise serializers.ValidationError({'new_password2': 'New passwords must match.'})
            
        return data
    
    # def save(self,**kwargs):
    #     password=self.validated_data['new_password1']
    #     user=self.context['request'].user
    #     user.set_password(password)
    #     user.save()
    #     return user