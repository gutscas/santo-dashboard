# Deployment Guide for Django + React

This guide explains how to set up your Ubuntu server to host your Django + React application using the CI/CD pipeline we created.

## Prerequisites
- **Ubuntu Server** (20.04 or 22.04 recommended)
- **SSH Access** to the server
- **Domain Name** (optional, but recommended. If no domain, use Server IP)

## Step 1: Initial Server Setup

SSH into your server and run the following commands to update the system and install necessary packages:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-pip python3-venv python3-dev libpq-dev postgresql postgresql-contrib nginx curl git
```

Install Node.js (Version 18):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

## Step 2: Clone the Repository

We will clone the repository to your home directory. Replace `yourusername` and `your-repo` with your actual GitHub details.

```bash
cd ~
git clone https://github.com/yourusername/your-repo.git santo-dashboard
cd santo-dashboard
```

## Step 3: Backend Setup

Create a virtual environment and install dependencies:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Run migrations and collect static files:
```bash
python manage.py migrate
python manage.py collectstatic
```

Create a `.env` file (if you use one) or ensure `SECRET_KEY` and `DEBUG` are set correctly in `settings.py` for production.

## Step 4: Gunicorn Setup

Create a Gunicorn systemd service file to run your Django app.

```bash
sudo nano /etc/systemd/system/gunicorn.service
```

Paste the following content (adjust paths if your username is not `ubuntu` or project path is different):

```ini
[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/santo-dashboard
ExecStart=/home/ubuntu/santo-dashboard/venv/bin/gunicorn --access-logfile - --workers 3 --bind unix:/home/ubuntu/santo-dashboard/myproject.sock myproject.wsgi:application

[Install]
WantedBy=multi-user.target
```
*Note: Replace `ubuntu` with your actual server username if different.*

Start and enable Gunicorn:
```bash
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
```

## Step 5: Nginx Setup

Create a new Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/santo-dashboard
```

Paste the following configuration:

```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    # Frontend (React)
    location / {
        root /home/ubuntu/santo-dashboard/santo-project/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend (Django API)
    location /api/ {
        include proxy_params;
        proxy_pass http://unix:/home/ubuntu/santo-dashboard/myproject.sock;
    }

    # Backend (Django Admin)
    location /admin/ {
        include proxy_params;
        proxy_pass http://unix:/home/ubuntu/santo-dashboard/myproject.sock;
    }

    # Django Static Files
    location /static/ {
        alias /home/ubuntu/santo-dashboard/staticfiles/;
    }

    # Django Media Files
    location /media/ {
        alias /home/ubuntu/santo-dashboard/media/;
    }
}
```
*Note: Replace `your_domain_or_ip` with your actual IP or domain. Replace `ubuntu` with your username.*

Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/santo-dashboard /etc/nginx/sites-enabled
sudo rm /etc/nginx/sites-enabled/default  # Remove default site if exists
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

## Step 6: Allow Passwordless Restart (Optional but Recommended for CI/CD)

For the GitHub Action to restart services without a password, edit the sudoers file:

```bash
sudo visudo
```

Add the following lines at the end (replace `ubuntu` with your username):

```
ubuntu ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart gunicorn
ubuntu ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx
```

## Step 7: GitHub Secrets

Go to your GitHub Repository -> Settings -> Secrets and variables -> Actions -> New repository secret. Add the following:

1.  **SERVER_IP**: The public IP address of your server.
2.  **SERVER_USER**: The username you use to SSH into the server (e.g., `ubuntu`).
3.  **SSH_PRIVATE_KEY**: The content of your private SSH key (e.g., `~/.ssh/id_rsa`).
    - *Tip: Generate a new key pair on your local machine `ssh-keygen`, add the public key to `~/.ssh/authorized_keys` on the server, and paste the private key here.*

## Verification

1.  Push your code to the `main` branch.
2.  Check the "Actions" tab in GitHub to see the workflow running.
3.  Once finished, visit your server IP/domain to see the deployed app.
