from django.test import TestCase
from dashboard.models import CustomUser
from rest_framework.test import APIClient
from django.urls import reverse


class UsernameEmailUniquenessTest(TestCase):
    """Test suite for username/email uniqueness constraints"""
    
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/register/'
        
    def test_duplicate_username_allowed(self):
        """Test that multiple users can register with the same username"""
        # Register first user
        response1 = self.client.post(self.register_url, {
            'username': 'john',
            'email': 'john1@test.com',
            'password': 'testpass123'
        })
        self.assertEqual(response1.status_code, 200)
        
        # Register second user with same username but different email
        response2 = self.client.post(self.register_url, {
            'username': 'john',  # Same username
            'email': 'john2@test.com',  # Different email
            'password': 'testpass123'
        })
        self.assertEqual(response2.status_code, 200)
        
        # Verify both users exist
        johns = CustomUser.objects.filter(username='john')
        self.assertEqual(johns.count(), 2)
        
    def test_duplicate_email_rejected(self):
        """Test that duplicate email addresses are rejected"""
        # Register first user
        response1 = self.client.post(self.register_url, {
            'username': 'user1',
            'email': 'duplicate@test.com',
            'password': 'testpass123'
        })
        self.assertEqual(response1.status_code, 200)
        
        # Try to register with duplicate email
        response2 = self.client.post(self.register_url, {
            'username': 'user2',
            'email': 'duplicate@test.com',  # Duplicate email
            'password': 'testpass123'
        })
        self.assertEqual(response2.status_code, 400)
        self.assertIn('email', str(response2.data).lower())
        
    def test_auto_generated_username(self):
        """Test that username is auto-generated from email when not provided"""
        response = self.client.post(self.register_url, {
            'username': '',  # Empty username
            'email': 'testuser@example.com',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, 200)
        
        # Check that username was auto-generated
        user = CustomUser.objects.get(email='testuser@example.com')
        self.assertEqual(user.username, 'testuser')
        
    def test_login_with_email(self):
        """Test that users can login using their email"""
        # Register users with same username
        self.client.post(self.register_url, {
            'username': 'john',
            'email': 'john1@test.com',
            'password': 'testpass123'
        })
        self.client.post(self.register_url, {
            'username': 'john',
            'email': 'john2@test.com',
            'password': 'testpass123'
        })
        
        # Login as first user
        login_response1 = self.client.post('/api/login/', {
            'email': 'john1@test.com',
            'password': 'testpass123'
        })
        self.assertEqual(login_response1.status_code, 200)
        self.assertIn('access', login_response1.data)
        
        # Login as second user
        login_response2 = self.client.post('/api/login/', {
            'email': 'john2@test.com',
            'password': 'testpass123'
        })
        self.assertEqual(login_response2.status_code, 200)
        self.assertIn('access', login_response2.data)
