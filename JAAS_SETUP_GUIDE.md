# JaaS (Jitsi as a Service) Setup Guide

## Overview

This application now supports Jitsi as a Service (JaaS) for professional-grade video conferencing. JaaS provides enhanced features, better reliability, and custom branding compared to the free Jitsi Meet service.

## Features

### JaaS Benefits:
- ✅ **Custom Domain**: Use your own branded domain
- ✅ **Guaranteed Uptime**: Enterprise-grade infrastructure
- ✅ **Enhanced Security**: JWT-based authentication
- ✅ **Recording**: Built-in meeting recording capabilities
- ✅ **Analytics**: Detailed usage analytics and reporting
- ✅ **Custom Branding**: Remove Jitsi watermarks and add your own
- ✅ **Priority Support**: Professional support from 8x8

### Fallback Support:
- 🔄 **Automatic Fallback**: If JaaS is not configured, the app automatically falls back to free Jitsi Meet
- 🔄 **Graceful Degradation**: No interruption to existing functionality

## Setup Instructions

### 1. Create JaaS Account

1. Visit [https://jaas.8x8.vc/](https://jaas.8x8.vc/)
2. Sign up for a JaaS account
3. Choose a subscription plan that fits your needs

### 2. Get Your Credentials

After creating your account, you'll need:

- **App ID**: Your unique application identifier
- **Private Key**: RSA private key for JWT signing
- **Key ID**: Identifier for your private key
- **Domain**: Your custom JaaS domain (format: `vpaas-magic-cookie-{app-id}.8x8.vc`)

### 3. Configure Backend Environment

Create a `.env` file in your backend directory (`src/backend/.env`):

```bash
# Backend Environment Variables
MONGODB_URI=your-mongodb-connection-string

# JaaS Configuration
JAAS_APP_ID=vpaas-magic-cookie-your-app-id-here
JAAS_PRIVATE_KEY_PATH=./jaas_private_key.pem
JAAS_KEY_ID=vpaas-magic-cookie-your-app-id-here/your-key-id
JAAS_DOMAIN=vpaas-magic-cookie-your-app-id-here.8x8.vc

# Server Configuration
PORT=5000
```

### 4. Private Key Setup

1. Download your private key from the JaaS console
2. Save it as `jaas_private_key.pem` in your backend directory (`src/backend/`)
3. Ensure the file has proper permissions (600 on Unix systems)
4. Update `JAAS_PRIVATE_KEY_PATH` to point to this file (relative path: `./jaas_private_key.pem`)

```bash
# Example private key setup (Unix/Linux/Mac)
cd src/backend/
# Place your downloaded private key here as jaas_private_key.pem
chmod 600 jaas_private_key.pem

# For Windows, ensure the file is readable by your application
```

**Important Security Note**: Never commit private key files to version control. They are already added to `.gitignore`.

### 5. Configure Frontend (Optional)

If you need to override the backend URL:

```bash
# Frontend Environment Variables (.env.local)
REACT_APP_BACKEND_URL=https://your-backend-domain.com
```

## Testing the Setup

### 1. Check Configuration

Start your backend server and look for these log messages:

```
✅ JaaS configured successfully
✅ Connected to MongoDB
✅ Server running on port 5000
```

### 2. Test Video Calls

1. Start a video call in your application
2. Look for the "JaaS Powered" badge in the video call header
3. Check browser console for JaaS-related logs:
   - `Using JaaS: true`
   - `Initializing Jitsi with domain: vpaas-magic-cookie-...`

### 3. Verify Fallback

To test the fallback mechanism:
1. Temporarily remove JaaS credentials from backend
2. Start a video call
3. Should see "Free Jitsi" badge and fallback to meet.jit.si

## Troubleshooting

### Common Issues

#### 1. "JaaS not configured" Error
- **Cause**: Missing or incorrect environment variables
- **Solution**: Verify all required environment variables are set correctly

#### 2. "Failed to generate JaaS token" Error
- **Cause**: Invalid private key or credentials
- **Solution**: 
  - Check private key file path and permissions
  - Verify credentials match your JaaS account

#### 3. Video Call Fails to Start
- **Cause**: Network issues or invalid domain
- **Solution**: 
  - Check if your JaaS domain is accessible
  - Verify JWT token is valid
  - Check browser console for detailed errors

#### 4. Falls Back to Free Jitsi
- **Cause**: Backend configuration issues
- **Solution**: 
  - Check backend logs for errors
  - Verify `/api/jaas/token` endpoint is accessible
  - Test endpoint manually with curl/Postman

### Debug Commands

```bash
# Test JaaS token generation
curl -X POST http://localhost:5000/api/jaas/token \
  -H "Content-Type: application/json" \
  -d '{
    "roomName": "test-room",
    "displayName": "Test User",
    "userEmail": "test@example.com"
  }'

# Check if backend is responding
curl http://localhost:5000/api/jaas/token

# Verify private key format
openssl rsa -in /path/to/your/private-key.pem -text -noout
```

## Production Deployment

### Security Considerations

1. **Private Key Security**: Store private keys securely, never in version control
2. **Environment Variables**: Use secure environment variable management
3. **HTTPS**: Always use HTTPS in production
4. **Token Expiration**: Tokens expire after 24 hours (configurable)

### Monitoring

Monitor these metrics:
- JaaS token generation success rate
- Video call initialization failures
- Fallback usage frequency

### Scaling

For high-traffic applications:
- Consider implementing token caching
- Monitor JaaS usage limits
- Set up proper logging and alerting

## Cost Optimization

- **Usage Monitoring**: Track JaaS usage vs. free Jitsi fallback
- **Plan Selection**: Choose the right JaaS plan for your needs
- **Efficient Fallback**: Let fallback handle low-priority calls

## Support

- **JaaS Support**: Contact 8x8 support for JaaS-specific issues
- **Application Support**: Check our application logs and documentation
- **Community**: Jitsi community forums for general Jitsi questions
