from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    """
    Custom User model that allows duplicate usernames but enforces unique emails.
    """
    # Override username to remove unique constraint
    username = models.CharField(max_length=150, blank=True)
    
    # Override email to enforce unique constraint
    email = models.EmailField(unique=True)
    
    # Keep email as the unique identifier for authentication
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Required for createsuperuser command
    
    class Meta:
        db_table = 'auth_user'  # Keep same table name to avoid migration issues
        
    def __str__(self):
        return self.email
