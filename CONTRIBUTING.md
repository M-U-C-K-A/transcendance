# Contributing to ft_transcendance

Thank you for your interest in contributing to ft_transcendance! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm package manager
- Docker and Docker Compose
- Git knowledge
- Basic understanding of TypeScript, React, and Fastify

### Setting Up Your Development Environment

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/transcendance.git
   cd transcendance
   ```
3. **Set up environment**
   ```bash
   ./buildEnv.sh
   ```
4. **Start development environment**
   ```bash
   make updev
   ```

## 📝 Development Guidelines

### Code Style
- **TypeScript**: All new code should be written in TypeScript
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Code formatting is handled automatically
- **File naming**: Use kebab-case for files and camelCase for variables/functions

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code formatting changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```bash
git commit -m "feat: add tournament bracket visualization"
git commit -m "fix: resolve WebSocket connection issue in chat"
git commit -m "docs: update installation instructions"
```

### Branch Naming
- `feature/description` - New features
- `bugfix/description` - Bug fixes  
- `hotfix/description` - Critical fixes
- `docs/description` - Documentation updates

## 🔧 Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Follow existing patterns and conventions
   - Add comments for complex logic

3. **Test your changes**
   ```bash
   # Start development environment
   make updev
   
   # Test frontend
   cd Front && pnpm run lint
   
   # Test backend (if applicable)
   cd Back && pnpm run lint
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**

### Pull Request Guidelines

- **Clear title and description**: Explain what changes you made and why
- **Link related issues**: Reference any issues your PR addresses
- **Screenshots**: Include screenshots for UI changes
- **Testing instructions**: Provide steps to test your changes
- **Small, focused changes**: Keep PRs small and focused on a single feature/fix

## 🐛 Reporting Bugs

### Before Reporting
1. Check if the bug has already been reported
2. Try to reproduce the bug in the latest version
3. Test in both development and production environments

### Bug Report Template
```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error...

**Expected Behavior**
What should happen.

**Actual Behavior**
What actually happens.

**Environment**
- OS: [e.g., Ubuntu 22.04]
- Browser: [e.g., Chrome 120]
- Docker version: [e.g., 24.0.0]

**Screenshots**
If applicable, add screenshots.

**Additional Context**
Any other relevant information.
```

## 💡 Feature Requests

### Before Requesting
1. Check if the feature already exists or is planned
2. Consider if it fits the project's scope and goals
3. Think about implementation complexity

### Feature Request Template
```markdown
**Feature Description**
A clear description of the feature.

**Use Case**
Why this feature would be useful.

**Proposed Solution**
How you envision the feature working.

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Any other relevant information.
```

## 🏗 Project Architecture

### Frontend (Front/)
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Babylon.js** for 3D graphics
- **Radix UI** for components

### Backend (Back/)
- **Fastify** web framework
- **Prisma** ORM with SQLite
- **Socket.io** for real-time features
- **JWT** for authentication

### Key Directories
- `Front/app/` - Next.js pages and layouts
- `Front/components/` - Reusable React components
- `Back/server/` - Fastify server implementation
- `Back/prisma/` - Database schema and migrations
- `Shared/` - Code shared between frontend and backend

## 🧪 Testing

### Manual Testing
- Test in both development and production Docker environments
- Verify functionality across different browsers
- Test real-time features with multiple users
- Check responsive design on various screen sizes

### Automated Testing
> Note: Test infrastructure is being developed. Contributors are welcome to help establish testing practices.

## 📚 Resources

### Learning Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Fastify Documentation](https://www.fastify.io/docs/)
- [Babylon.js Documentation](https://doc.babylonjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)

### Project-Specific Guides
- [Docker Setup Guide](README.md#-docker-setup-recommended)
- [Environment Configuration](README.md#️-environment-configuration)
- [Project Structure](README.md#-project-structure)

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check the main README.md first

## 🙏 Recognition

Contributors will be recognized in:
- Git commit history
- Release notes for significant contributions
- README acknowledgments for major contributors

---

Thank you for contributing to ft_transcendance! Every contribution, whether it's a bug fix, feature addition, or documentation improvement, helps make this project better for everyone.