# FileShare Backend - Deployment Guide

This guide covers deploying the FileShare backend to various hosting platforms.

## 🚀 Quick Start

### 1. Prepare Your Environment

```bash
# Clone the repository
git clone <your-repo-url>
cd file_sharing/backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit environment variables
nano .env
```

### 2. Environment Variables

Create a `.env` file with the following variables:

```env
# Required
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fileshare
NODE_ENV=production
PORT=3000

# Optional
FRONTEND_URL=https://your-frontend-domain.com
JWT_SECRET=your-super-secret-key
```

## 🌐 Deployment Platforms

### Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create your-fileshare-app
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGO_URI="your-mongodb-uri"
   heroku config:set NODE_ENV="production"
   heroku config:set FRONTEND_URL="https://your-frontend-domain.com"
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Railway

1. **Connect Repository**
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select the backend directory

2. **Set Environment Variables**
   - Add `MONGO_URI`
   - Add `NODE_ENV=production`
   - Add `FRONTEND_URL`

3. **Deploy**
   - Railway will automatically deploy on push

### DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect your repository
   - Select Node.js environment

2. **Configure Environment**
   ```yaml
   environment:
     - MONGO_URI=your-mongodb-uri
     - NODE_ENV=production
     - FRONTEND_URL=https://your-frontend-domain.com
   ```

3. **Deploy**
   - DigitalOcean will build and deploy automatically

### Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   - Go to Vercel dashboard
   - Add environment variables

### AWS EC2

1. **Launch EC2 Instance**
   ```bash
   # Connect to your instance
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm nginx
   ```

3. **Clone and Setup**
   ```bash
   git clone <your-repo-url>
   cd file_sharing/backend
   npm install
   cp env.example .env
   # Edit .env file
   ```

4. **Setup PM2**
   ```bash
   npm install -g pm2
   pm2 start index.js --name fileshare-backend
   pm2 startup
   pm2 save
   ```

5. **Setup Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/fileshare
   ```

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/fileshare /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a free cluster

2. **Get Connection String**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

3. **Update Environment**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fileshare?retryWrites=true&w=majority
   ```

### Local MongoDB

```bash
# Install MongoDB
sudo apt install mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create database
mongo
use fileshare
```

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env` files
- Use strong, unique secrets
- Rotate secrets regularly

### 2. CORS Configuration
```javascript
// Update CORS origin in production
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true
};
```

### 3. Rate Limiting
- Configure appropriate limits for your use case
- Monitor for abuse

### 4. File Upload Security
- Validate file types
- Limit file sizes
- Scan for malware (consider additional services)

## 📊 Monitoring

### Health Check
```bash
curl https://your-api-domain.com/health
```

### Logs
```bash
# Heroku
heroku logs --tail

# Railway
railway logs

# PM2
pm2 logs fileshare-backend
```

## 🔧 Performance Optimization

### 1. Enable Compression
```javascript
app.use(compression());
```

### 2. Use CDN for Static Files
- Consider using AWS S3 or similar for file storage
- Implement CDN for better global performance

### 3. Database Optimization
- Add indexes to frequently queried fields
- Monitor query performance

### 4. Caching
- Implement Redis for session storage
- Cache frequently accessed data

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check connection string
   - Verify network access
   - Check credentials

2. **CORS Errors**
   - Verify FRONTEND_URL is correct
   - Check CORS configuration

3. **File Upload Fails**
   - Check file size limits
   - Verify upload directory permissions
   - Check disk space

4. **Port Already in Use**
   - Change PORT in environment
   - Kill existing processes

### Debug Mode
```bash
# Enable debug logging
NODE_ENV=development npm start
```

## 📈 Scaling

### Horizontal Scaling
- Use load balancers
- Implement session sharing
- Use shared file storage

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Use caching strategies

## 🔄 CI/CD

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm test
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: ${{ secrets.HEROKU_APP_NAME }}
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

## 📞 Support

For deployment issues:
1. Check logs for error messages
2. Verify environment variables
3. Test locally first
4. Check platform-specific documentation

---

**Happy Deploying! 🚀** 