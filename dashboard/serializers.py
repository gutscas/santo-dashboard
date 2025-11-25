from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from .models import UserProfile, Post

# Get the custom user model
User = get_user_model()

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }

    def validate_email(self, value):
        """Ensure email is unique"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        # Pop username from validated_data (it might be empty, None, or a valid username)
        username = validated_data.pop('username', None)
        
        # If username is empty or None, generate it from email
        if not username or username.strip() == '':
            email = validated_data['email']
            username = email.split('@')[0]
        
        # Create user with the generated or provided username (duplicates allowed)
        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

# Login Serializer
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            # Since CustomUser.USERNAME_FIELD = 'email', authenticate with email
            user = authenticate(username=email, password=password)
            if user and user.is_active:
                return user
        
        raise serializers.ValidationError("Incorrect Credentials")

# UserProfile Serializer
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
    class Meta:
        model = UserProfile
        exclude = ('user',)

# Post Serializer
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
