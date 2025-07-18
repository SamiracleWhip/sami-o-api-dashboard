# Sami-O API Dashboard

A modern, user-specific API key management dashboard built with Next.js, Supabase, and NextAuth.js.

## ✨ Features

- 🔑 **User-Specific API Keys**: Each user has their own isolated set of API keys
- 🔐 **Secure Authentication**: Google OAuth integration with NextAuth.js
- 📊 **Modern Dashboard**: Real-time API key management interface
- 🎮 **API Playground**: Key validation and testing tools
- 🛡️ **Database Security**: Row Level Security (RLS) policies for data isolation
- 📱 **Responsive Design**: Mobile-first UI with Tailwind CSS
- 🔗 **REST API**: Proper REST endpoints following industry standards

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **Authentication**: NextAuth.js with Google OAuth
- **UI Components**: Lucide React Icons, Custom components
- **Database**: Supabase with Row Level Security
- **Deployment**: Vercel-ready

## 🏗️ Architecture

### User-Specific API Key System
- Complete user isolation at database level
- JWT-based authentication with session management
- Centralized authentication helpers in `lib/api-auth.js`
- REST API endpoints under `/api/users/me/api-keys/`

### Security Features
- Row Level Security (RLS) policies
- Ownership verification on all operations
- Automatic user filtering
- Multi-layer security validation

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google OAuth credentials

### 1. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd sami-o

# Install dependencies
npm install
# or
yarn install
```

### 2. Environment Setup

Create a `.env.local` file:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-here-32-chars-minimum
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional
OPENAI_API_KEY=your-openai-key
```

### 3. Database Setup

1. Create a Supabase project
2. Run the database migration:
   ```sql
   -- Execute in Supabase SQL Editor
   -- See supabase/schema.sql for complete setup
   ```
3. Enable Row Level Security policies

### 4. Development

```bash
# Start development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📚 API Documentation

### Authentication
All API endpoints require JWT authentication via NextAuth.js sessions.

### Endpoints

#### Collection Operations
- `GET /api/users/me/api-keys` - Get user's API keys
- `POST /api/users/me/api-keys` - Create new API key

#### Individual Operations
- `GET /api/users/me/api-keys/{id}` - Get specific API key
- `PUT /api/users/me/api-keys/{id}` - Update API key
- `DELETE /api/users/me/api-keys/{id}` - Delete API key
- `POST /api/users/me/api-keys/{id}/regenerate` - Regenerate API key

#### Utility Endpoints
- `POST /api/validate-key` - Validate API key
- `POST /api/github-summarizer` - GitHub repository analysis
- `POST /api/create-test-key` - Generate test API key

See `REST_API_STRUCTURE.md` for detailed API documentation.

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**: Import your GitHub repo to Vercel
2. **Environment Variables**: Add all required env vars in Vercel dashboard
3. **Configuration**: Update OAuth and Supabase settings for production URL
4. **Deploy**: Vercel will automatically build and deploy

See `VERCEL_DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

### Build Commands

```bash
# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Clean install
npm run clean
```

## 🛠️ Development

### Project Structure

```
sami-o/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── users/me/api-keys/  # User-specific endpoints
│   ├── dashboards/        # Dashboard pages
│   └── page.js           # Homepage
├── lib/                   # Utilities
│   ├── api-auth.js       # Centralized authentication
│   ├── auth.js           # NextAuth configuration
│   └── supabase.js       # Database client
├── hooks/                 # React hooks
│   └── useApiKeys.ts     # API keys hook
├── components/           # React components
└── supabase/            # Database schema & migrations
```

### Key Components

- **Authentication**: `lib/api-auth.js` - Centralized auth helpers
- **Database**: Supabase with RLS policies
- **Frontend**: React hooks for state management
- **API**: RESTful endpoints with proper error handling

## 🔧 Configuration

### Google OAuth Setup
1. Create project in Google Cloud Console
2. Configure OAuth 2.0 client
3. Add authorized redirect URIs
4. Copy client ID and secret

### Supabase Setup
1. Create new project
2. Run database migration
3. Configure authentication
4. Set up Row Level Security

See `SUPABASE_SETUP.md` for detailed instructions.

## 🐛 Debugging

### Debug Endpoints (Development Only)
- `/api/debug/session` - Authentication flow debugging
- `/api/debug/env` - Environment variables check
- `/api/test-db` - Database connection test

### Common Issues
- **Authentication Errors**: Check JWT tokens and user database entries
- **Database Errors**: Verify RLS policies and migrations
- **Build Errors**: Ensure all imports and TypeScript types are correct

See `DEBUGGING_GUIDE.md` for comprehensive troubleshooting.

## 📄 Documentation

- `USER_SPECIFIC_API_KEYS.md` - Implementation details
- `REST_API_STRUCTURE.md` - API documentation
- `VERCEL_DEPLOYMENT_GUIDE.md` - Production deployment
- `DEBUGGING_GUIDE.md` - Troubleshooting guide
- `IMPLEMENTATION_SUMMARY.md` - Complete project overview

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is private and proprietary.

## 🆘 Support

For issues and questions:
1. Check the debugging guide
2. Review the documentation
3. Test with debug endpoints
4. Check server logs and environment variables

---

**Status**: ✅ Production Ready - Multi-user API key management with enterprise-grade security.
