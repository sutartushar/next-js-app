# Keen - AI-Powered Document Intelligence Platform

A sophisticated, full-stack document intelligence platform built with Next.js 16, React, and AI SDK. Keen transforms how teams manage, search, and extract insights from documents using semantic search, AI-powered analysis, and knowledge graph visualization.

## 🎯 Platform Overview

Keen addresses the critical challenge of document intelligence: **finding the right information in large document collections instantly, with AI-powered insights, not just keyword matching**. This platform demonstrates advanced architectural patterns including:

- **Semantic Search**: Vector embeddings with pgvector HNSW indexing for sub-500ms search across millions of documents
- **Multi-tenant Workspaces**: Enterprise-grade workspace management with role-based access control
- **AI-Powered Intelligence**: Document summarization, entity extraction, sentiment analysis, and automated tagging
- **Knowledge Graphs**: Relationship mapping between documents for discovery and context understanding
- **Real-time Analytics**: Search history tracking and performance insights
- **Secure Architecture**: Row-level security (RLS), secure authentication, and encrypted data handling

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend**: Next.js Route Handlers, Server Actions, API routes
- **Database**: PostgreSQL (Supabase) with pgvector extension
- **AI/ML**: Vercel AI SDK 6 with OpenAI embeddings and text generation
- **Styling**: Tailwind CSS v4 with design tokens
- **Authentication**: Supabase Auth with secure sessions

### Database Schema

#### Core Tables
- **workspaces**: Multi-tenant workspace containers with ownership and collaboration
- **workspace_members**: Role-based access control (owner, editor, viewer)
- **documents**: Document metadata, content, and processing status
- **document_chunks**: Content split into chunks with embeddings for semantic search
- **document_insights**: AI-generated summaries, entities, topics, and metadata
- **knowledge_edges**: Relationship graph between documents and entities
- **search_history**: Audit trail and analytics for search queries

#### Key Features
- **Vector Search**: HNSW indexing on `document_chunks.embedding` (1536-dim vectors)
- **Row-Level Security**: Comprehensive RLS policies ensuring data isolation
- **Performance Indexes**: Strategic indexes on workspace_id, document_id, and timestamps

## 🚀 Core Features

### 1. Document Management
- **Upload & Processing**: Batch document upload with automatic chunking
- **Content Indexing**: Automatic embedding generation and vector storage
- **Metadata Management**: Rich metadata, tags, and file type support
- **Version Tracking**: Document creation and update timestamps

### 2. Semantic Search
- **Vector Similarity**: Search by meaning, not keywords
- **Hybrid Search**: Combine semantic and keyword matching
- **Fast Retrieval**: Sub-500ms search on HNSW indexed vectors
- **Context Snippets**: Return relevant chunks with source documents

### 3. Document Intelligence
- **Automatic Summarization**: AI-generated document summaries
- **Entity Extraction**: Named entity recognition (people, organizations, locations)
- **Sentiment Analysis**: Emotional tone detection (positive, negative, neutral)
- **Topic Modeling**: Automatic topic identification and relevance scoring
- **Auto-tagging**: Machine-generated tags for categorization

### 4. Knowledge Discovery
- **Relationship Mapping**: Automatic relationship detection between documents
- **Entity Networks**: Visual representation of document connections
- **Citation Tracking**: Understand document interdependencies
- **Topic Clustering**: Group related documents automatically

### 5. Analytics & Insights
- **Search Metrics**: Query volume, execution time, result quality
- **User Behavior**: Track search patterns and popular queries
- **Performance Monitoring**: Document indexing status and bottleneck detection
- **Trend Analysis**: Identify emerging topics and themes

## 🔐 Security & Privacy

### Authentication & Authorization
- **Secure Auth**: Supabase Auth with email/password authentication
- **Session Management**: HTTP-only cookies with automatic refresh
- **Role-Based Access**: Owner, Editor, Viewer roles per workspace
- **Token Encryption**: Secure token storage and validation

### Data Protection
- **Row-Level Security (RLS)**: Database-level access control
- **Data Isolation**: Complete multi-tenant separation
- **Secure Endpoints**: All API routes require authentication
- **Input Validation**: Zod schemas for request validation

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - Logout

### Workspaces
- `GET /api/workspaces` - List user's workspaces
- `POST /api/workspaces` - Create new workspace
- `GET /api/workspaces/[id]` - Get workspace details
- `PUT /api/workspaces/[id]` - Update workspace
- `DELETE /api/workspaces/[id]` - Delete workspace

### Documents
- `GET /api/workspaces/[id]/documents` - List workspace documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/[id]/insights` - Get AI insights
- `DELETE /api/documents/[id]` - Delete document

### Search
- `POST /api/search` - Semantic search query
- `GET /api/workspaces/[id]/search-history` - Get search analytics

### AI Analysis
- `POST /api/embed` - Generate embeddings
- `POST /api/analyze` - Analyze document content

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account with pgvector extension enabled

### Installation
```bash
# Install dependencies
pnpm install

# Set up environment variables
# Copy .env.example to .env.local and add:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY

# Run development server
pnpm dev

# Open http://localhost:3000
```

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

## 📁 Project Structure

```
app/
  ├── auth/                           # Authentication pages
  │   ├── login/page.tsx
  │   ├── sign-up/page.tsx
  │   └── callback/route.ts
  ├── workspaces/page.tsx             # Workspace listing
  ├── workspace/[id]/page.tsx          # Workspace dashboard
  └── api/
      ├── auth/                       # Auth endpoints
      ├── workspaces/                 # Workspace API routes
      ├── documents/                  # Document management
      ├── search/route.ts             # Semantic search
      ├── embed/route.ts              # Embedding generation
      └── analyze/route.ts            # Document analysis

components/
  ├── navbar.tsx                      # Main navigation
  ├── auth/user-menu.tsx              # Auth user menu
  └── workspace/
      ├── workspace-header.tsx        # Workspace info
      ├── document-upload.tsx         # File upload interface
      ├── document-list.tsx           # Document grid/list
      ├── semantic-search.tsx         # Search interface
      ├── document-insights.tsx       # AI insights view
      └── knowledge-graph.tsx         # Relationship visualization

lib/
  ├── supabase/                       # Supabase clients
  │   ├── client.ts                   # Browser client
  │   ├── server.ts                   # Server client
  │   └── proxy.ts                    # Auth proxy
  └── utils/
      ├── document.ts                 # Document utilities
      └── embedding.ts                # Embedding helpers
```

## 🎨 Design System

### Color Palette
- **Primary**: Deep Indigo (`oklch(0.52 0.22 258.9)`) - Brand identity
- **Accent**: Warm Orange (`oklch(0.62 0.18 38)`) - Call-to-action
- **Background**: Clean White (`oklch(0.98 0 0)`) / Dark (`oklch(0.12 0 0)`)
- **Neutral**: Professional Grays - UI elements and borders

### Typography
- **Display**: Geist Sans (headings, brand)
- **Body**: Geist Sans (readable, accessible)
- **Mono**: Geist Mono (code, data display)

## 🔬 Advanced Concepts

### Semantic Search Implementation
1. **Chunking Strategy**: Documents split into overlapping 512-token chunks
2. **Embedding Generation**: OpenAI `text-embedding-3-small` (1536 dimensions)
3. **Vector Storage**: pgvector with HNSW indexing (m=16, ef_construction=64)
4. **Similarity Search**: Cosine similarity on normalized vectors
5. **Result Ranking**: Hybrid ranking combining semantic and lexical relevance

### Multi-tenancy Architecture
- **Workspace Isolation**: Every query filtered by workspace_id
- **RLS Enforcement**: Database-level access control
- **Member Management**: Flexible role assignment and revocation
- **Audit Trail**: Search and action history per user

### AI Integration Patterns
- **Streaming Analysis**: Real-time token streaming for large documents
- **Structured Output**: Zod schemas for consistent AI responses
- **Error Handling**: Graceful fallbacks for AI failures
- **Rate Limiting**: Prevent abuse of expensive operations

## 📈 Performance Optimization

### Database Optimization
- **HNSW Indexing**: <500ms semantic search on 1M+ vectors
- **Strategic Indexes**: Composite indexes on common filter patterns
- **Connection Pooling**: Efficient database connection management
- **Query Optimization**: Parameterized queries and prepared statements

### Frontend Optimization
- **Code Splitting**: Next.js automatic route-based splitting
- **Image Optimization**: Automatic image compression and format selection
- **Caching Strategy**: SWR for intelligent client-side caching
- **Performance Monitoring**: Real-time performance metrics

## 🧪 Testing & Quality

### Testing Strategy
- **Unit Tests**: Individual component and utility functions
- **Integration Tests**: API endpoint and database operations
- **E2E Tests**: Complete user workflows (signup, upload, search)
- **Performance Tests**: Embedding generation and search speed

### Code Quality
- **TypeScript**: Full type safety throughout the application
- **ESLint**: Consistent code style and best practices
- **Input Validation**: Zod schemas for all API inputs
- **Error Handling**: Comprehensive error messages and logging

## 🚢 Deployment

### Vercel Deployment
```bash
# Push to GitHub
git push origin main

# Automatic deployment via Vercel CI/CD
# Environment variables configured in Vercel dashboard
```

### Supabase Configuration
1. Enable pgvector extension
2. Run migrations to create schema
3. Configure RLS policies
4. Set up JWT secret for auth

## 📚 Documentation

### Key Files
- `ARCHITECTURE.md` - Detailed system architecture
- `API.md` - Complete API reference
- `SECURITY.md` - Security implementation details
- `DEPLOYMENT.md` - Deployment procedures

## 🤝 Contributing

This platform demonstrates production-grade patterns for:
- Semantic search at scale
- Multi-tenant SaaS architectures
- AI integration in modern web apps
- Enterprise security practices

## 📝 License

MIT License - Feel free to use this as a reference implementation.

---

**Built with Next.js 16, React 19, AI SDK 6, and PostgreSQL**
