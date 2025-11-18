from rest_framework import serializers
from .models import *
class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [ 'id', 'first_name', 'last_name',  'email', 'age']
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['first_name', 'last_name',  'email', 'password', 'age']
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        account=Account(**validated_data)
        account.set_password(validated_data['password'])
        account.save()
        return account
class SkinImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkinImage
        fields = '__all__'

class HistorySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    condition = serializers.CharField(source='analysis_result')
    date = serializers.SerializerMethodField()
    confidence = serializers.FloatField()
    
    class Meta:
        model = History
        fields = ['id', 'condition', 'date', 'confidence', 'image_url']
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and obj.image.image:
            return request.build_absolute_uri(obj.image.image.url) if request else obj.image.image.url
        return None
    
    def get_date(self, obj):
        return obj.created_at.strftime("%Y-%m-%d %H:%M")
class EducationMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationMaterial
        fields = '__all__'
        