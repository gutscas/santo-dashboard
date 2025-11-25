from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
import random
from .models import Post, UserProfile, PasswordResetOTP
from .serializers import PostSerializer, RegisterSerializer, LoginSerializer, UserSerializer, UserProfileSerializer

# Get the custom user model
User = get_user_model()

# Post ViewSet
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]

# Register API
@api_view(['POST'])
def register_api(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return Response({
        "user": UserSerializer(user, context=serializer.context).data,
        "message": "User Created Successfully.  Now perform Login to get your token",
    })

# Login API
@api_view(['POST'])
def login_api(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })
    return Response(serializer.errors, status=400)

# UserProfile API
class UserProfileAPI(APIView):
    def get(self, request, pk=None):
        if pk:
            try:
                profile = UserProfile.objects.get(pk=pk)
                serializer = UserProfileSerializer(profile)
                return Response(serializer.data)
            except UserProfile.DoesNotExist:
                return Response({"error": "Profile not found"}, status=404)
        return Response({"error": "PK required"}, status=400)

    def post(self, request):
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request, pk=None):
        return self.patch(request, pk)

    def patch(self, request, pk=None):
        if not pk:
            return Response({"error": "PK required"}, status=400)
        try:
            profile = UserProfile.objects.get(pk=pk)
            serializer = UserProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except UserProfile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=404)

    def delete(self, request, pk=None):
        if not pk:
            return Response({"error": "PK required"}, status=400)
        try:
            profile = UserProfile.objects.get(pk=pk)
            profile.delete()
            return Response({"message": "Profile deleted successfully"}, status=204)
        except UserProfile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=404)

class UserProfileListAPI(generics.ListAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

# Get or Create User Profile for authenticated user
@api_view(['GET', 'POST', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def get_user_profile(request):
    try:
        profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        profile = None
    
    if request.method == 'GET':
        if profile:
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        return Response({"error": "Profile not found"}, status=404)
    
    elif request.method == 'POST':
        # Create profile for logged in user
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    elif request.method == 'PATCH':
        if not profile:
            return Response({"error": "Profile not found. Create one first."}, status=404)
        
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

# Password Reset APIs
@api_view(['POST'])
def forgot_password(request):
    """Generate and send OTP to user's email"""
    email = request.data.get('email')
    
    if not email:
        return Response({"error": "Email is required"}, status=400)
    
    # Check if user exists
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "No user found with this email"}, status=404)
    
    # Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    
    # Delete any existing OTPs for this email
    PasswordResetOTP.objects.filter(email=email).delete()
    
    # Create new OTP
    PasswordResetOTP.objects.create(email=email, otp=otp)
    
    # Send email
    try:
        send_mail(
            'Password Reset OTP',
            f'Your OTP for password reset is: {otp}\n\nThis OTP will expire in 10 minutes.',
            'noreply@yourapp.com',
            [email],
            fail_silently=False,
        )
        return Response({"message": "OTP sent to your email"}, status=200)
    except Exception as e:
        return Response({"error": f"Failed to send email: {str(e)}"}, status=500)

@api_view(['POST'])
def verify_otp(request):
    """Verify the OTP code"""
    email = request.data.get('email')
    otp = request.data.get('otp')
    
    if not email or not otp:
        return Response({"error": "Email and OTP are required"}, status=400)
    
    try:
        otp_obj = PasswordResetOTP.objects.get(email=email, otp=otp)
        
        if not otp_obj.is_valid():
            return Response({"error": "OTP has expired or already been used"}, status=400)
        
        return Response({"message": "OTP verified successfully"}, status=200)
    except PasswordResetOTP.DoesNotExist:
        return Response({"error": "Invalid OTP"}, status=400)

@api_view(['POST'])
def reset_password(request):
    """Reset password with valid OTP"""
    email = request.data.get('email')
    otp = request.data.get('otp')
    new_password = request.data.get('new_password')
    
    if not email or not otp or not new_password:
        return Response({"error": "Email, OTP, and new password are required"}, status=400)
    
    try:
        otp_obj = PasswordResetOTP.objects.get(email=email, otp=otp)
        
        if not otp_obj.is_valid():
            return Response({"error": "OTP has expired or already been used"}, status=400)
        
        # Get user and reset password
        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        
        # Mark OTP as used
        otp_obj.is_used = True
        otp_obj.save()
        
        return Response({"message": "Password reset successfully"}, status=200)
    except PasswordResetOTP.DoesNotExist:
        return Response({"error": "Invalid OTP"}, status=400)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
