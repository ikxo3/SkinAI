from django.db import models
from django.contrib.auth.models import AbstractBaseUser

class Account(AbstractBaseUser):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  
    age = models.IntegerField(null=True, blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    def __str__(self):
        return self.email
class SkinImage(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='skin_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Image {self.id} uploaded at {self.uploaded_at}"
class History(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE)
    image = models.ForeignKey(SkinImage, on_delete=models.CASCADE)
    analysis_result = models.TextField()
    confidence = models.FloatField(null=True, blank=True) 
    created_at = models.DateTimeField(auto_now_add=True)  
    
    def __str__(self):
        return f"History {self.id} for user {self.user.email}"
class EducationMaterial(models.Model):
    image = models.ImageField(upload_to='education_materials/')
    title = models.CharField(max_length=200)
    content = models.TextField()
    def __str__(self):
        return self.title
""""


"""