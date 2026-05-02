# Keen Platform Architecture

## System Overview

Keen is a sophisticated AI-powered document intelligence platform designed for enterprise-scale semantic search, AI analysis, and knowledge discovery. This document describes the architectural decisions, data flow, and technical patterns.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 16)                    │
│  ┌──────────────┬──────────────┬──────────────────────────┐  │
│  │  Auth Pages  │  Workspaces  │  Document Dashboard      │  │
│  │              │              │  - Upload               │  │
│  │              │              │  - Search               │  │
│  │              │              │  - Analytics            │  │
│  └──────────────┴──────────────┴──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                  Next.js Route Handlers                      │
│  ┌──────────────┬──────────────┬──────────────────────────┐  │
│  │   Auth API   │  Workspaces  │  Documents              │  │
│  │              │   API        │  - Upload/Process       │  │
│  │              │              │  - Embed/Analyze        │  │
│  │              │              │  - Search               │  │
│  └──────────────┴──────────────┴──────────────────────────┘  │
│                                                               │
│  ┌──────────────┬──────────────┬──────────────────────────┐  │
│  │  Knowledge   │  Analytics   │  AI Operations          │  │
│  │   Graph API  │   API        │  - Text Generation      │  │
│  │              │              │  - Embeddings           │  │
│  └──────────────┴──────────────┴──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  ┌──────────────┬──────────────┬──────────────────────────┐  │
│  │ PostgreSQL   │ OpenAI API   │ Supabase Auth           │  │
│  │ (Supabase)   │ (AI Gateway) │                         │  │
│  │ - pgvector   │ - Embeddings │ - JWT Sessions          │  │
│  │ - HNSW Index │ - Text Gen   │ - User Management       │  │
│  └──────────────┴──────────────┴──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Document Upload & Indexing

```
User Upload → API Route (/documents/upload)
    ↓
    Validate file & extract text
    ↓
    Store document metadata in `documents` table
    ↓
    Chunk text (512 tokens, 100 token overlap)
    ↓
    Generate embeddings (1536-dim vectors)
    ↓
    Store chunks + embeddings in `document_chunks` table
    ↓
    Trigger AI analysis (summarization, entity extraction)
    ↓
    Store insights in `document_insights` table
    ↓
    Build knowledge graph edges
    ↓
    Return success with document metadata
```

### 2. Semantic Search

```
User Query → Semantic Search Component
    ↓
    Generate query embedding (same model as documents)
    ↓
    API Route (/search)
    ↓
    PostgreSQL Vector Search:
      - Cosine similarity on pgvector HNSW index
      - Return top-k similar chunks
      - Join with parent documents
    ↓
    Hybrid ranking (semantic + lexical)
    ↓
    Format results with snippets
    ↓
    Log search to `search_history` (for analytics)
    ↓
    Return results to component
    ↓
    Display with relevance scores & source documents
```

### 3. Document Analysis Pipeline

```
Analyzed Document → Analysis API (/analyze)
    ↓
    Extract text content
    ↓
    Parallel AI Operations:
      - Summarization (streaming)
      - Entity extraction (structured output)
      - Sentiment analysis
      - Topic modeling
    ↓
    Store results in `document_insights`
    ↓
    Extract relationships for knowledge graph
    ↓
    Return insights to UI
```

## Database Schema Design

### Core Entities

#### Workspaces
```sql
CREATE TABLE workspaces (
  id UUID PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```
**Purpose**: Multi-tenant isolation, collaboration spaces

#### Workspace Members
```sql
CREATE TABLE workspace_members (
  id UUID PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id),
  user_id UUID REFERENCES auth.users(id),
  role TEXT ('owner' | 'editor' | 'viewer'),
  created_at TIMESTAMP
)
```
**Purpose**: RBAC, team collaboration

#### Documents
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  is_indexed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```
**Purpose**: Document storage with metadata

#### Document Chunks
```sql
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY,
  document_id UUID REFERENCES documents(id),
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536) NOT NULL,
  start_position INTEGER,
  end_position INTEGER,
  created_at TIMESTAMP
)
CREATE INDEX ON document_chunks USING hnsw (embedding vector_cosine_ops)
```
**Purpose**: Semantic search backbone
**Index Type**: HNSW (Hierarchical Navigable Small World)
- **m**: 16 (connections per node)
- **ef_construction**: 64 (construction parameter)
- **Search Performance**: <500ms for 1M vectors

#### Document Insights
```sql
CREATE TABLE document_insights (
  id UUID PRIMARY KEY,
  document_id UUID REFERENCES documents(id),
  summary TEXT,
  key_entities JSONB, -- [{name, type, relevance}]
  auto_tags TEXT[],
  sentiment TEXT ('positive' | 'negative' | 'neutral'),
  topics JSONB, -- [{name, relevance}]
  metadata JSONB,
  created_at TIMESTAMP
)
```
**Purpose**: AI-generated intelligence about documents

#### Knowledge Edges
```sql
CREATE TABLE knowledge_edges (
  id UUID PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id),
  source_id UUID,
  target_id UUID,
  relationship_type TEXT,
  strength FLOAT (0.0 to 1.0),
  metadata JSONB,
  created_at TIMESTAMP
)
```
**Purpose**: Relationship mapping for knowledge graphs

#### Search History
```sql
CREATE TABLE search_history (
  id UUID PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id),
  user_id UUID REFERENCES auth.users(id),
  query TEXT NOT NULL,
  results_count INTEGER,
  execution_time_ms INTEGER,
  filters JSONB DEFAULT '{}',
  created_at TIMESTAMP
)
```
**Purpose**: Analytics and audit trail

### Row-Level Security (RLS) Strategy

Every table has comprehensive RLS policies:

1. **Workspaces**: Users can only access workspaces they own or are members of
2. **Workspace Members**: Only workspace members can view other members
3. **Documents**: Only accessible through workspace membership
4. **Document Chunks**: Inherited through document → workspace relationship
5. **Document Insights**: Inherited through document → workspace relationship
6. **Knowledge Edges**: Scoped to workspace
7. **Search History**: Users only see their own searches

## API Route Architecture

### Authentication Flow

```
User Signup/Login → Auth Route (/api/auth/*)
    ↓
    Supabase Auth (email/password)
    ↓
    Create JWT session (HTTP-only cookie)
    ↓
    Redirect to /auth/callback
    ↓
    Exchange code for session
    ↓
    Redirect to dashboard
```

### Workspace API Routes

```
GET /api/workspaces
├─ Fetch user's workspaces
├─ Apply RLS (user is owner or member)
└─ Return: { workspaces: Workspace[] }

POST /api/workspaces
├─ Create new workspace
├─ Set current user as owner
├─ Create initial workspace_members entry
└─ Return: { workspace: Workspace }

GET /api/workspaces/[id]
├─ Verify user access via RLS
├─ Fetch workspace + member count
└─ Return: { workspace, members }
```

### Document API Routes

```
POST /api/documents/upload
├─ Validate file (max 25MB)
├─ Extract text content
├─ Create document record
├─ Split into chunks
├─ Generate embeddings (AI SDK)
├─ Store chunks + vectors
├─ Trigger analysis (background)
└─ Return: { document, processedChunks }

GET /api/workspaces/[id]/documents
├─ Filter by workspace_id
├─ Apply RLS
├─ Include document insights
└─ Return: { documents: Document[] }

DELETE /api/documents/[id]
├─ Verify ownership through workspace
├─ Delete document (cascade deletes chunks/insights)
└─ Return: { success: true }
```

### Search API Routes

```
POST /api/search
├─ Input: { query: string, workspaceId: string }
├─ Generate query embedding
├─ pgvector similarity search:
│   ├─ SELECT * FROM document_chunks
│   ├─ WHERE workspace matches user's workspaces
│   ├─ ORDER BY embedding <-> query_embedding LIMIT 10
│   └─ JOIN with documents for context
├─ Hybrid ranking (optional keyword match)
├─ Log search to search_history
└─ Return: { results: SearchResult[], executionTime: number }
```

### AI Analysis Routes

```
POST /api/analyze
├─ Input: { documentId: string }
├─ Validate user has access
├─ Stream AI operations:
│   ├─ generateText() for summarization
│   ├─ generateObject() for structured extraction
│   └─ Multiple parallel calls
├─ Store results in document_insights
├─ Extract entities for knowledge graph
└─ Return: { insights: DocumentInsights }

POST /api/embed
├─ Input: { text: string }
├─ Generate embedding via AI SDK
├─ Return: { embedding: number[] }
```

## Security Implementation

### Authentication & Authorization

1. **User Authentication**
   - Supabase Auth with email/password
   - JWT tokens in HTTP-only cookies
   - Automatic token refresh via middleware

2. **Authorization (RBAC)**
   - Workspace owner: full control
   - Editor: can upload/modify documents
   - Viewer: read-only access

3. **API Security**
   - All routes check `auth.getUser()`
   - RLS enforced at database level
   - Input validation with Zod schemas

### Data Protection

1. **Transport Security**
   - HTTPS enforced in production
   - Secure cookies with HttpOnly, SameSite flags

2. **Database Security**
   - Encrypted connections to Postgres
   - Row-level security policies
   - No sensitive data in logs

3. **AI/LLM Security**
   - No documents sent to external APIs
   - Embeddings generated server-side
   - Streaming responses (no long-term storage)

## Performance Optimization

### Vector Search Performance

**HNSW Index Configuration**:
```sql
CREATE INDEX document_chunks_embedding_idx 
  ON public.document_chunks 
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
```

**Performance Characteristics**:
- **Indexing**: O(log N) with high constant factor
- **Search**: O(log N) average case
- **Memory**: ~250 bytes per vector (for 1536-dim vectors)
- **Typical Latency**: 10-500ms depending on index size

### Query Optimization

1. **Connection Pooling**: Supabase handles connection pooling
2. **Caching**: SWR for client-side data caching
3. **Pagination**: Limit results to top-k (default 10)
4. **Indexes**: Strategic indexes on:
   - workspace_id
   - document_id
   - created_at DESC

### Frontend Optimization

1. **Code Splitting**: Next.js automatic route-based
2. **Image Optimization**: Next/Image component
3. **Client Caching**: SWR with revalidation
4. **Streaming**: AI analysis with streaming responses

## Scalability Considerations

### Multi-tenancy Scaling

- **Workspace Isolation**: Each query filtered by workspace_id at DB level
- **RLS Enforcement**: Prevents data leakage without application logic
- **Independent Analytics**: Per-workspace metrics don't interfere

### Vector Index Scaling

- **HNSW Efficiency**: Performs well up to 10M+ vectors
- **Sharding Strategy**: Partition by workspace if needed
- **Incremental Indexing**: New vectors added continuously

### API Scaling

- **Stateless Route Handlers**: Scale horizontally
- **External Services**: OpenAI API handles capacity
- **Rate Limiting**: Prevent abuse of expensive operations

## Monitoring & Observability

### Metrics Collected

1. **Search Metrics**
   - Query execution time
   - Results returned
   - Unique queries

2. **Document Metrics**
   - Upload success rate
   - Indexing duration
   - Document count per workspace

3. **System Metrics**
   - API response times
   - Error rates
   - Token usage

### Analytics Dashboard

- Real-time metrics on workspace overview
- Top searches by frequency
- Performance trends
- Document insights coverage

## Technology Choices & Rationale

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Framework** | Next.js 16 | SSR, API routes, optimal for full-stack |
| **Database** | PostgreSQL + pgvector | Native vector support, RLS, proven at scale |
| **AI/Embeddings** | OpenAI via AI SDK | Best quality embeddings, through Vercel gateway |
| **Auth** | Supabase Auth | Built-in user management, JWT sessions |
| **Styling** | Tailwind CSS | Performance, design tokens, accessibility |
| **Vector Index** | HNSW | Fast search, low memory, PostgreSQL native |

## Future Enhancements

1. **Batch Processing**: Queue system for large document uploads
2. **Real-time Collaboration**: WebSockets for live document editing
3. **Advanced Analytics**: ML-based anomaly detection
4. **Custom Models**: Fine-tuning on workspace-specific data
5. **Export/Reporting**: PDF reports, data exports
6. **Integrations**: Slack, Teams, Notion connectors
