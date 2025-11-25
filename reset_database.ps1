# Database Reset and Migration Script
# Run these commands in order to reset your database and apply the new schema

# Step 1: Delete the existing database (WARNING: This will delete all existing user data)
Remove-Item -Path "db.sqlite3" -Force

# Step 2: Delete all migration files except __init__.py
Get-ChildItem -Path "dashboard\migrations\*.py" -Exclude "__init__.py" | Remove-Item -Force

# Step 3: Create fresh migrations
python manage.py makemigrations

# Step 4: Apply migrations
python manage.py migrate

# Step 5: Create a superuser (optional)
python manage.py createsuperuser
