# 🏓 ft_transcendance

<div align="center">

![Transcendance Logo](https://via.placeholder.com/400x200?text=ft_transcendance)

**The Ultimate Pong Experience - 42 School Final Project**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Fastify](https://img.shields.io/badge/Fastify-5.3.2-green?style=flat&logo=fastify&logoColor=white)](https://www.fastify.io/)
[![Babylon.js](https://img.shields.io/badge/Babylon.js-6.0.0-orange?style=flat&logo=babylon.js&logoColor=white)](https://www.babylonjs.com/)

*A modern, real-time multiplayer Pong game with 3D graphics, tournaments, and social features*

</div>

## 🎯 Project Overview

**ft_transcendance** is the capstone project of the 42 School curriculum, representing the culmination of our web development journey. This project transforms the classic Pong game into a modern, feature-rich platform with real-time multiplayer capabilities, stunning 3D graphics, and comprehensive social features.

Built with cutting-edge technologies and containerized for seamless deployment, ft_transcendance demonstrates mastery of full-stack development, real-time communication, 3D graphics programming, and modern DevOps practices.

### 🏆 Project Goals

- **Master Full-Stack Development**: Implement a complete web application from database to user interface
- **Real-Time Communication**: Build seamless multiplayer experiences with WebSocket technology
- **3D Graphics Programming**: Create immersive game experiences using modern 3D engines
- **Modern Web Technologies**: Leverage the latest frameworks and tools for optimal performance
- **Containerization & DevOps**: Deploy applications using Docker and modern infrastructure practices
- **User Experience**: Design intuitive interfaces with accessibility and internationalization in mind

## ✨ Features

### 🎮 Game Features
- **3D Pong Gameplay**: Immersive 3D Pong experience powered by Babylon.js
- **Real-Time Multiplayer**: Live multiplayer matches with WebSocket communication
- **Tournament System**: Organized tournaments with bracket progression
- **ELO Rating System**: Competitive ranking system for skilled players
- **Custom Game Settings**: Configurable game parameters and visual options
- **Match History**: Comprehensive game statistics and historical data

### 👥 Social Features
- **User Profiles**: Customizable profiles with avatars and bios
- **Friends System**: Add friends, view online status, and track activities
- **Real-Time Chat**: Instant messaging with friends and global chat
- **User Blocking**: Privacy controls for unwanted interactions
- **Online Status**: Live presence indicators for all users

### 🔐 Security & Authentication
- **Google OAuth Integration**: Secure authentication with Google accounts
- **Two-Factor Authentication (2FA)**: Enhanced security with TOTP support
- **JWT Tokens**: Secure session management
- **Data Privacy**: GDPR-compliant data handling

### 🌍 User Experience
- **Internationalization**: Multi-language support (i18n)
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark/Light Theme**: User-preferred theme selection
- **Accessibility**: WCAG-compliant interface design

## 🛠 Technology Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Component-based UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Babylon.js](https://www.babylonjs.com/)** - 3D graphics engine
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible UI components
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library

### Backend
- **[Fastify](https://www.fastify.io/)** - Fast and low overhead web framework
- **[Prisma](https://www.prisma.io/)** - Type-safe database ORM
- **[SQLite](https://www.sqlite.org/)** - Lightweight database engine
- **[Socket.io](https://socket.io/)** - Real-time communication
- **[JWT](https://jwt.io/)** - JSON Web Token authentication

### Infrastructure
- **[Docker](https://www.docker.com/)** - Containerization platform
- **[Docker Compose](https://docs.docker.com/compose/)** - Multi-container orchestration
- **[Nginx](https://nginx.org/)** - Reverse proxy and load balancer
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager

## 📸 Screenshots

> **Note**: Screenshots will be added here to showcase the application's interface and gameplay.

<div align="center">

### Game Interface
![Game Interface](https://via.placeholder.com/800x400?text=Game+Interface+Screenshot)

### Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)

### Tournament View
![Tournament](https://via.placeholder.com/800x400?text=Tournament+Screenshot)

### Profile Management
![Profile](https://via.placeholder.com/800x400?text=Profile+Screenshot)

</div>

## 🚀 Quick Start

### Prerequisites

- **Docker** and **Docker Compose** installed on your system
- **Node.js 18+** and **pnpm** (for manual setup)
- **Git** for version control

### 🐳 Docker Setup (Recommended)

#### Production Environment

1. **Clone the repository**
```bash
git clone https://github.com/M-U-C-K-A/transcendance.git
cd transcendance
```

2. **Configure environment variables**
```bash
# Run the environment setup script
./buildEnv.sh
```
You'll be prompted to enter:
- Google Client ID
- Google Client Secret  
- Google Redirect URI

3. **Start the application**
```bash
# Build and start all services
make up

# Or use Docker Compose directly
docker-compose -f docker-compose-prod.yml up --build
```

4. **Access the application**
- **Main Application**: https://localhost:8443
- **HTTP Redirect**: http://localhost:8080 (redirects to HTTPS)
- **Database Studio**: http://localhost:5555 (Prisma Studio)

#### Development Environment

For development with hot reload:

```bash
# Start development environment
make updev

# Or use Docker Compose directly
docker-compose -f docker-compose-dev.yml up --build
```

### 🔧 Manual Setup

#### Backend Setup

1. **Navigate to backend directory**
```bash
cd Back
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Setup database**
```bash
# Generate Prisma client
pnpx prisma generate --schema=./prisma/schema.prisma

# Create and migrate database
pnpx prisma db push --schema=./prisma/schema.prisma

# (Optional) Seed database with test data
pnpm run db:seed
```

4. **Start development server**
```bash
pnpm run dev:server
```

#### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd Front
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Start development server**
```bash
pnpm run dev
```

### ⚙️ Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
# Network Configuration
LOCAL_IP=your_local_ip
HOSTNAME=localhost
NEXT_PUBLIC_HOSTNAME=localhost

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_redirect_uri
GOOGLE_AFTER_LOGIN=https://localhost:8443/en/dashboard

# WebSocket Configuration
NEXT_PUBLIC_WEBSOCKET_FOR_CHAT=wss://localhost:3001/wss/chat
NEXT_PUBLIC_WEBSOCKET_FOR_FRIENDS=wss://localhost:3001/wss/friends

# Email Configuration (Optional)
SMTP_PASS=your_smtp_password
SMTP_MAIL=your_smtp_email
```

## 🎮 Usage

### Getting Started

1. **Access the Application**
   - Open https://localhost:8443 in your browser
   - You'll be redirected to the authentication page

2. **Create an Account**
   - Sign up with Google OAuth
   - Complete your profile setup
   - Configure optional 2FA for enhanced security

3. **Play Your First Game**
   - Navigate to the Game section
   - Choose "Quick Match" for instant gameplay
   - Customize game settings as desired
   - Wait for matchmaking or invite a friend

4. **Explore Social Features**
   - Add friends from the user search
   - Join the global chat or message friends directly
   - View leaderboards and player statistics

### Game Controls

- **Movement**: Use W/S keys or Arrow keys to move your paddle
- **Menu**: ESC key to access in-game menu
- **Chat**: Enter key to open chat during gameplay

### Tournament Participation

1. Create or join a tournament from the Tournament section
2. Wait for the tournament bracket to fill
3. Compete in bracket-style elimination matches
4. Win the tournament to earn ranking points and achievements

## 📁 Project Structure

```
transcendance/
├── Back/                    # Backend application
│   ├── server/             # Fastify server implementation
│   ├── prisma/             # Database schema and migrations  
│   ├── config/             # Server configuration
│   └── Dockerfile.*        # Backend Docker configurations
├── Front/                   # Frontend application
│   ├── app/                # Next.js App Router pages
│   ├── components/         # Reusable React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and configs
│   └── Dockerfile.*        # Frontend Docker configurations
├── Shared/                  # Shared code between front/back
│   ├── types/              # TypeScript type definitions
│   └── schemas/            # Zod validation schemas
├── Nginx/                   # Reverse proxy configuration
│   └── nginx.conf          # Nginx configuration file
├── docker-compose-*.yml     # Docker Compose configurations
├── Makefile                # Development shortcuts
└── buildEnv.sh             # Environment setup script
```

## 🤝 Contributing

We welcome contributions to ft_transcendance! Please read our contributing guidelines before getting started.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed
4. **Test your changes**
   ```bash
   # Run linting
   pnpm run lint
   
   # Test the application
   make updev
   ```
5. **Commit and push**
   ```bash
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request**

### Code Style

- Use **TypeScript** for all new code
- Follow **ESLint** configuration
- Use **Prettier** for code formatting
- Write meaningful commit messages following [Conventional Commits](https://www.conventionalcommits.org/)

### Reporting Issues

Please use the [GitHub Issues](https://github.com/M-U-C-K-A/transcendance/issues) page to report bugs or request features. Include:

- Clear description of the issue
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details

## 🔒 Security

### Reporting Security Vulnerabilities

If you discover a security vulnerability, please send an email to our security team instead of using the public issue tracker.

### Security Features

- **Authentication**: Secure OAuth integration with Google
- **Authorization**: JWT-based session management
- **Data Protection**: GDPR-compliant data handling
- **Input Validation**: Comprehensive input sanitization
- **HTTPS**: Enforced encrypted connections
- **Rate Limiting**: Protection against abuse

## 📋 Available Scripts

### Development Scripts

```bash
# Docker operations
make up          # Start production environment
make updev       # Start development environment  
make start       # Start production services (without build)
make startdev    # Start development services (without build)
make down        # Stop all services
make clean       # Clean Docker resources

# Frontend development (in Front/ directory)
pnpm run dev     # Start Next.js development server
pnpm run build   # Build production frontend
pnpm run start   # Start production frontend
pnpm run lint    # Run ESLint

# Backend development (in Back/ directory)
pnpm run dev:server  # Start Fastify development server
pnpm run db:seed     # Seed database with test data

# Database operations (in Back/prisma/ directory)
pnpx prisma studio           # Open Prisma Studio
pnpx prisma generate         # Generate Prisma client
pnpx prisma db push          # Push schema changes to database
pnpx prisma migrate dev      # Create and apply migrations
```

## 🚀 Deployment

### Production Deployment

1. **Prepare production environment**
   ```bash
   ./buildEnv.sh
   ```

2. **Build and deploy**
   ```bash
   make up
   ```

3. **Verify deployment**
   - Check all services are running: `docker-compose ps`
   - Access application at configured domain
   - Monitor logs: `docker-compose logs -f`

### Environment-Specific Configurations

- **Development**: Uses hot reload, exposed ports, volume mounts
- **Production**: Optimized builds, internal networking, SSL certificates

## 📄 License

This project is part of the 42 School curriculum and is intended for educational purposes. 

> **Note**: A formal license file will be added. Please respect the educational nature of this project.

## 🙏 Acknowledgments

### 42 School Community
Special thanks to the **42 School** community and fellow students who provided feedback, testing, and collaborative support throughout the development process.

### Technology Partners
- **[Vercel](https://vercel.com/)** for Next.js framework and deployment insights
- **[Babylon.js Community](https://www.babylonjs.com/)** for 3D graphics resources and documentation
- **[Prisma Team](https://www.prisma.io/)** for excellent ORM tools and database management
- **[Fastify Community](https://www.fastify.io/)** for high-performance backend framework

### Open Source Projects
This project builds upon numerous open-source libraries and tools. We're grateful to all the maintainers and contributors who make modern web development possible.

### Development Team
- **[Your Name/Team Names]** - Core development team

---

<div align="center">

**Built with ❤️ at [42 School](https://42.fr/)**

*ft_transcendance - Where classic Pong meets modern web technology*

[![42 School](https://img.shields.io/badge/42-School-000000?style=flat&logo=42&logoColor=white)](https://42.fr/)

</div>