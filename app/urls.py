from django.urls import path ,include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from .views import *
router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'skin-images', SkinImageViewSet, basename='skin-images')
router.register(r'histories', HistoryViewSet, basename='histories')
router.register(r'Etu', EducationMaterialViewSet, basename='Etu')


urlpatterns = [
    path('', include(router.urls)),
    path('login/',login_view, name='login'),       
    path('SkinAI/', index_view, name='index'),  
    path('welcome/', landing_view, name='landing'),
    path('404/', page_404, name='error_404'),
    
] +static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)