from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta

class CustomUser(AbstractUser):
    """
    Custom User model that allows duplicate usernames but enforces unique emails.
    """
    # Override username to remove unique constraint
    username = models.CharField(max_length=150, blank=True)
    
    # Override email to enforce unique constraint
    email = models.EmailField(unique=True)
    
    # Override groups and user_permissions to avoid conflicts
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='customuser_set',
        related_query_name='customuser',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='customuser_set',
        related_query_name='customuser',
    )
    
    # Keep email as the unique identifier for authentication
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Required for createsuperuser command
        
    def __str__(self):
        return self.email



class Post(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class UserProfile(models.Model):
    user = models.OneToOneField('dashboard.CustomUser', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    file = models.FileField(upload_to='uploads/', blank=True, null=True)  # accepts any file

    def __str__(self):
        return self.name

class PasswordResetOTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def is_valid(self):
        """Check if OTP is still valid (not expired and not used)"""
        expiry_time = self.created_at + timedelta(minutes=10)
        return not self.is_used and timezone.now() < expiry_time

    def __str__(self):
        return f"OTP for {self.email}"
