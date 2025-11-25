from django.contrib.auth import authenticate
from dashboard.models import CustomUser

# Get the test user
user = CustomUser.objects.get(email='test@test.com')
print(f'User email: {user.email}')
print(f'User username: {user.username}')
print(f'User is_active: {user.is_active}')

# Test password check
password = 'Test123456'
password_correct = user.check_password(password)
print(f'Password check result: {password_correct}')

# Test authentication
auth_result = authenticate(username=user.username, password=password)
print(f'Authentication result: {auth_result}')

if not password_correct:
    print('\nPassword is WRONG. Setting new password to Test123456...')
    user.set_password('Test123456')
    user.save()
    print('Password updated successfully!')
    
    # Test again
    print(f'New password check: {user.check_password("Test123456")}')
