from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    PostViewSet, register_api, login_api, UserProfileAPI, 
    UserProfileListAPI, get_user_profile, forgot_password, 
    verify_otp, reset_password
)

# Router for Post

urlpatterns = [

    # Auth
    path('register/', register_api),
    path('login/', login_api),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # UserProfile
    path('profile/me/', get_user_profile),                # GET/POST/PATCH current user profile
    path('profiles/', UserProfileAPI.as_view()),          # POST → create
    path('profiles/<int:pk>/', UserProfileAPI.as_view()), # GET / PATCH / PUT / DELETE
    path('profiles/all/', UserProfileListAPI.as_view()),
    
    # Password Reset
    path('forgot-password/', forgot_password),            # POST - send OTP
    path('verify-otp/', verify_otp),                     # POST - verify OTP
    path('reset-password/', reset_password),             # POST - reset password
]
