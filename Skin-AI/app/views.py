import os
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Sum
from pathlib import Path
from .serializer import *
from rest_framework_simplejwt.tokens import RefreshToken
from .models import *
from rest_framework.decorators import action
from datetime import date, timedelta
from .tretement import process_image 
from django.conf import settings

MODEL_PATH = os.path.join(settings.BASE_DIR, 'ModelAI', 'best.pt')       
class AuthViewSet(viewsets.ModelViewSet):
    
    queryset = Account.objects.none() 
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    
    def register(self, request):
        #red
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user) 
            return Response(
                {"refresh": str(refresh),  
                 "access": str(refresh.access_token),
                 "user": AccountSerializer(user).data},  
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({"detail": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = Account.objects.get(email=email)
            if not user.check_password(password):
                return Response({"detail": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)
                
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': AccountSerializer(user).data
            }, status=status.HTTP_200_OK)
            
        except Account.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        user = request.user
        serializer = AccountSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        refresh_token = request.data.get('refresh')  
        if not refresh_token:
            return Response({"detail": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Successfully logged out"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = os.path.join(BASE_DIR, 'ModelAI', 'best.pt')
CONFIDENCE_THRESHOLD = 0.6 

class SkinImageViewSet(viewsets.ModelViewSet):

    queryset = SkinImage.objects.none()
    serializer_class = SkinImageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return SkinImage.objects.filter(user = self.request.user)   
    @action(detail=False, methods=['POST'], permission_classes=[IsAuthenticated])
    def upload_image(self ,request):
        serializer = SkinImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated])
    def tretement(self, request):
        print(f"Using model: {MODEL_PATH}")

        image_id = request.query_params.get('image_id')
        if not image_id:
            return Response({"detail": "Image ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        skin_image = get_object_or_404(SkinImage, id=image_id, user=request.user)
        save_path, diagnosis = process_image(skin_image.image.path, MODEL_PATH)
        if isinstance(diagnosis, str):
            return Response({"detail": diagnosis}, status=status.HTTP_400_BAD_REQUEST)
        
        history = History.objects.create(
            user=request.user,
            image=skin_image,
            analysis_result=diagnosis['class_name'],
            confidence=round(diagnosis['conf'] * 100, 2)
        )
        
        result_data = {
            "image_path": skin_image.image.url if skin_image.image else None,
            "diagnosis": [
                {
                    "class_name": diagnosis['class_name'],
                    "conf": round(diagnosis['conf'] * 100, 2)  
                }
            ],
            "history": {
                "id": history.id,
                "analysis_result": history.analysis_result,
                "confidence": round(history.confidence, 2) ,
                "created_at": history.created_at,
                "image_url": skin_image.image.url if skin_image.image else None
            }
        }
        
        return Response(result_data, status=status.HTTP_200_OK)
class HistoryViewSet(viewsets.ModelViewSet):
    queryset = History.objects.all()
    serializer_class = HistorySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return History.objects.filter(user=self.request.user)
    @action(detail=False, methods=['POST'], permission_classes=[IsAuthenticated])
    def add_history(self ,request):
        serializer = HistorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated])
    def get_history(self ,request):
        histories = History.objects.filter(user=request.user)
        serializer = HistorySerializer(histories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class EducationMaterialViewSet(viewsets.ModelViewSet):
    queryset = EducationMaterial.objects.none()
    serializer_class = EducationMaterialSerializer
    permission_classes = [IsAuthenticated]
    data1 = {
        "image": "education_materials/acne.jpg",
        "title": "Understanding Acne",
        "content": "Acne is a common skin condition that occurs when hair follicles become clogged with oil and dead skin cells. It can cause pimples, blackheads, and cysts. Treatment options include topical creams, oral medications, and lifestyle changes."
    }
    data2 = {
        "image": "education_materials/eczema.jpg",
        "title": "Managing Eczema",
        "content": "Eczema is a chronic skin condition characterized by dry, itchy, and inflamed skin. It can be triggered by allergens, irritants, and stress. Management includes moisturizing regularly, avoiding triggers, and using prescribed medications."
    }
    data3 = {
        "image": "education_materials/psoriasis.jpg",
        "title": "Living with Psoriasis",
        "content": "Psoriasis is an autoimmune condition that causes rapid skin cell turnover, leading to thick, scaly patches on the skin. It can be managed with topical treatments, phototherapy, and systemic medications."
    }
    deta4= {
        "image":"education_materials/vitiligo.jpg",
        "title":"Coping with Vitiligo",
        "content":"Vitiligo is a condition where the skin loses its pigment cells, resulting in white patches. It can affect any part of the body and may be associated with autoimmune diseases. Treatment options include topical corticosteroids , light therapy, and cosmetic camouflage."
       
    }
    data5={
        "image":"education_materials/rosacea.jpg",
        "title":"Understanding Rosacea",
        "content":"Rosacea is a chronic skin condition that causes redness, visible blood vessels, and sometimes pimples on the face. It can be triggered by sun exposure, spicy foods, alcohol, and stress. Management includes avoiding triggers, using gentle skincare products, and prescribed medications."
    }
    data6={
        "image":"education_materials/skin_cancer.jpg",
        "title":"Skin Cancer Awareness",
        "content":"Skin cancer is the abnormal growth of skin cells, often caused by excessive sun exposure. The most common types are basal cell carcinoma, squamous cell carcinoma, and melanoma. Prevention includes using sunscreen, wearing protective clothing, and regular skin checks."
    }
    data7={
        "image":"education_materials/aging_skin.jpg",
        "title":"Caring for Aging Skin",
        "content":"As we age, our skin undergoes changes such as reduced elasticity, dryness, and the appearance of wrinkles. To care for aging skin, use moisturizers, stay hydrated, protect against sun damage, and consider using anti-aging products with ingredients like retinoids and antioxidants."
    }
    list_data = [data1, data2, data3, deta4, data5, data6, data7]
    for data in list_data:
        if not EducationMaterial.objects.filter(title=data["title"]).exists():
            EducationMaterial.objects.create(**data)
    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated])
    def list_materials(self, request):
        materials = EducationMaterial.objects.all()
        serializer = EducationMaterialSerializer(materials, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
from django.shortcuts import render

def landing_view(request):
    return render(request, "landing.html")
def login_view(request):
    return render(request, "login-page.html")
def index_view(request):
    return render(request, "index.html")
def landing_view(request):
    return render(request, "landing.html")
def tutorial(request):
    return render(request, "video.html")
