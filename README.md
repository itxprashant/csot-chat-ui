# 🚀 ChatUI - Modern Real-Time Chat Application

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)](https://www.mongodb.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11.10.0-orange.svg)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black.svg)](https://vercel.com/)

> A feature-rich, real-time chat application built with modern web technologies, offering seamless communication with video calling, real-time translation, and beautiful UI.

## ✨ Features

### 🎯 Core Features
- **Real-time Messaging** - Instant message delivery with live updates
- **User Authentication** - Secure login and registration system
- **Multi-user Support** - Chat with multiple users simultaneously
- **Responsive Design** - Works perfectly on desktop and mobile devices

### 🔥 Advanced Features
- **🎥 Video Calling** - High-quality video calls powered by Jitsi Meet
- **🌐 Real-time Translation** - Multi-language support with Google Cloud Translate
- **🔔 Smart Notifications** - Real-time notifications for new messages
- **📁 Advanced File Sharing** - Upload and share multiple file types with Cloudinary storage
  - Images, videos, audio files
  - Documents (PDF, Word, Excel, PowerPoint)
  - Archives and text files
  - Drag-and-drop upload with progress indicators
  - File previews and inline rendering
- **🎨 Modern UI** - Beautiful, intuitive interface with smooth animations

### 🛠️ Technical Features
- **Firebase Integration** - Real-time database and authentication
- **MongoDB Atlas** - Cloud-based data storage
- **JWT Authentication** - Secure token-based authentication
- **RESTful API** - Clean, scalable backend architecture
- **PWA Ready** - Progressive Web App capabilities

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Express Backend│    │   MongoDB Atlas │
│                 │    │                 │    │                 │
│ • Chat Interface│◄──►│ • REST API      │◄──►│ • User Data     │
│ • Video Calls   │    │ • Real-time     │    │ • Chat History  │
│ • Translations  │    │ • Authentication│    │ • File Metadata │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Firebase      │    │   Jitsi Meet    │    │ Google Translate│
│ • Real-time DB  │    │ • Video Calls   │    │ • Language API  │
│ • Authentication│    │ • Screen Share  │    │ • Auto-detect   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Firebase account (optional, for enhanced features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/itxprashant/csot-chat-ui.git
   cd chat-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   REACT_APP_API_URL=http://localhost:3000
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   
   # Cloudinary Configuration (for file uploads)
   REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   REACT_APP_CLOUDINARY_API_KEY=your_cloudinary_api_key
   REACT_APP_CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   REACT_APP_CLOUDINARY_UPLOAD_PRESET=chat_files
   ```

4. **Set up Cloudinary for file uploads** (Optional but recommended)
   - Create a free account at [cloudinary.com](https://cloudinary.com)
   - Get your Cloud Name, API Key, and API Secret from the dashboard
   - Create an unsigned upload preset named "chat_files"
   - See [FILE_UPLOAD_SETUP.md](FILE_UPLOAD_SETUP.md) for detailed instructions

5. **Start the development server**
   ```bash
   # Start backend server
   node src/backend/server.js
   
   # Start frontend (in another terminal)
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Usage

### Getting Started
1. **Register** - Create a new account or login with existing credentials
2. **Start Chatting** - Select a user from the sidebar to start a conversation
3. **Send Messages** - Type your message and press Enter or click Send
4. **Video Call** - Click the video call button to start a video conversation
5. **Translation** - Enable translation settings to communicate in different languages

### Key Features Guide

#### 💬 Real-time Messaging
- Messages appear instantly across all connected devices
- Message status indicators (sent, delivered, read)
- Typing indicators to show when someone is typing

#### 🎥 Video Calling
- One-click video calls with high-quality streaming
- Screen sharing capabilities
- Mute/unmute audio and video controls
- Guest-friendly rooms (no account required for participants)

#### 🌐 Translation
- **Auto-translate**: Automatically translate incoming messages
- **Language Detection**: Smart detection of message languages
- **20+ Languages**: Support for major world languages
- **Original Text**: Option to show both original and translated text

#### 📁 File Sharing
- Drag and drop file uploads
- Support for images, documents, and media files
- File preview and download capabilities
- Progress indicators for uploads

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0** - Modern React with latest features
- **React Router** - Client-side routing
- **CSS3** - Custom styling with animations
- **Jitsi React SDK** - Video calling integration

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Services & APIs
- **Firebase** - Real-time database and authentication
- **Google Cloud Translate** - Translation services
- **Jitsi Meet** - Video calling platform
- **MongoDB Atlas** - Cloud database hosting
- **Cloudinary** - File storage and optimization CDN

### Development Tools
- **React Scripts** - Build and development tools
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Vercel** - Deployment platform

## 📦 Project Structure

```
chat-ui/
├── 📁 public/                 # Static assets
├── 📁 src/
│   ├── 📁 components/         # React components
│   │   ├── ChatWindow.js      # Main chat interface
│   │   ├── VideoCall.js       # Video calling component
│   │   ├── TranslationComponent.js
│   │   └── NotificationPanel.js
│   ├── 📁 hooks/              # Custom React hooks
│   │   ├── useChat.js         # Chat functionality
│   │   └── useNotifications.js
│   ├── 📁 services/           # External services
│   │   └── translationService.js
│   ├── 📁 firebase/           # Firebase configuration
│   ├── 📁 backend/            # Backend server
│   │   ├── server.js          # Main server file
│   │   └── 📁 models/         # Database models
│   ├── App.js                 # Main React component
│   └── index.js               # Entry point
├── 📁 build/                  # Production build
├── package.json               # Dependencies
├── firebase.json              # Firebase configuration
├── vercel.json               # Vercel deployment config
└── README.md                 # This file
```

## 🔧 Configuration

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Set up database access and network access
4. Get your connection string
5. Add it to your `.env` file

Detailed setup instructions: [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)

### Firebase Setup (Optional)
1. Create a Firebase project
2. Enable Firestore Database
3. Get your Firebase configuration
4. Add the config to your `.env` file

### Translation Service
The app includes a mock translation service for development. For production:
1. Set up Google Cloud Translate API
2. Get your API key
3. Replace the mock service with the real API

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**
   Add your environment variables in the Vercel dashboard

4. **Update API URL**
   Update your production API URL in the environment variables

Detailed deployment guide: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### Alternative Deployment Options
- **Netlify** - Frontend deployment
- **Heroku** - Full-stack deployment
- **AWS** - Scalable cloud deployment
- **Google Cloud** - Google Cloud Platform

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **Input Validation** - Server-side validation for all inputs
- **CORS Protection** - Cross-origin resource sharing controls
- **Environment Variables** - Secure configuration management

## 🎨 UI/UX Features

- **Responsive Design** - Mobile-first approach
- **Dark/Light Theme** - Theme switching capabilities
- **Smooth Animations** - CSS transitions and animations
- **Loading States** - User-friendly loading indicators
- **Error Handling** - Graceful error messages
- **Accessibility** - ARIA labels and keyboard navigation

## 📊 Performance

- **Code Splitting** - Lazy loading for better performance
- **Caching** - Browser caching for static assets
- **Compression** - Gzip compression for faster loading
- **CDN Ready** - Optimized for content delivery networks

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Jitsi Team** - For the open-source video calling solution
- **MongoDB** - For the powerful database platform
- **Firebase** - For real-time capabilities
- **Google Cloud** - For translation services

## 📞 Support

- **Documentation** - Check the docs folder for detailed guides
- **Issues** - Report bugs on GitHub Issues
- **Discussions** - Join our GitHub Discussions
- **Email** - Contact us at support@chatui.com

## 🎯 Roadmap

### v1.1 (Coming Soon)
- [ ] Group chat functionality
- [ ] Message encryption
- [ ] Voice messages
- [ ] Custom themes

### v1.2 (Future)
- [ ] Desktop application
- [ ] Mobile app (React Native)
- [ ] Advanced admin panel
- [ ] Analytics dashboard

### v2.0 (Long-term)
- [ ] AI-powered chat suggestions
- [ ] Advanced file sharing
- [ ] Integration with popular tools
- [ ] Enterprise features

---

<div align="center">
  <p>Built with ❤️ by the ChatUI Team</p>
  <p>
    <a href="https://github.com/itxprashant/csot-chat-ui">⭐ Star us on GitHub</a> |
  </p>
</div>

## 📈 Project Stats

![GitHub stars](https://img.shields.io/github/stars/itxprashant/csot-chat-ui?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/chat-ui?style=social)
![GitHub issues](https://img.shields.io/github/issues/itxprashant/csot-chat-ui)
![GitHub pull requests](https://img.shields.io/github/issues-pr/itxprashant/csot-chat-ui)
![GitHub license](https://img.shields.io/github/license/itxprashant/csot-chat-ui)

---

*Made with React, Node.js, and lots of ☕*
