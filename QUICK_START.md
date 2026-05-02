# Quick Start Guide - Keen Document Intelligence Platform

## 🚀 Getting Started (5 minutes)

### 1. Initial Setup
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`

### 2. First Login
1. Navigate to **Sign Up** page
2. Create account with email and password
3. Confirm email verification (check spam folder)
4. You're logged in! 🎉

### 3. Create Your First Workspace
1. Click **"New Workspace"** button
2. Enter workspace name and description
3. Click **"Create"**
4. You're now inside your workspace

### 4. Upload a Document
1. Drag and drop a document (TXT, PDF, DOCX)
2. Or click **"Upload"** to browse files
3. System automatically:
   - Chunks the document (512 char chunks with overlap)
   - Generates embeddings using AI
   - Extracts entities, topics, and sentiment
   - Creates knowledge relationships

### 5. Search Your Documents
1. Use the **Search** bar at the top
2. Type your query (e.g., "machine learning" or "sales metrics")
3. Results show:
   - Document matches
   - Relevance scores
   - Relevant chunks highlighted
   - Related documents

---

## 📊 Key Features at a Glance

### Document Management
- **Upload**: Support TXT, PDF, DOCX, etc.
- **Organize**: Tag documents for easy discovery
- **Delete**: Remove documents (cascades to chunks and insights)

### Intelligent Search
- **Semantic Search**: Understands meaning, not just keywords
- **Hybrid Search**: Combines semantic + keyword matching
- **Real-time Results**: Sub-500ms response times
- **Search History**: Track what you've searched

### AI Insights
- **Auto-Summary**: 2-3 sentence summary of each document
- **Entity Extraction**: People, places, organizations, concepts
- **Sentiment Analysis**: Positive/negative/neutral tone
- **Auto-Tags**: Automatic categorization
- **Topic Modeling**: What's this document really about?

### Knowledge Graph
- **Visualize Relationships**: See how documents connect
- **Relationship Types**: relates_to, mentions, cites, etc.
- **Confidence Scores**: Know how strong the connection is
- **Network Analysis**: Identify important documents and hubs

### Analytics Dashboard
- **Search Trends**: What queries are trending?
- **Document Stats**: Most viewed, most relevant
- **User Activity**: Who's searching what
- **Performance Metrics**: Response times, accuracy scores

---

## 🏗️ Architecture Overview

### Frontend Stack
- Next.js 16 with React 19
- TypeScript for type safety
- Tailwind CSS with custom design tokens
- shadcn/ui components (40+)
- Recharts for data visualization

### Backend Stack
- Next.js API Routes
- Supabase PostgreSQL with pgvector
- AI SDK 6 with Vercel AI Gateway
- OpenAI embeddings (1536 dimensions)

### Database Schema
```
Workspaces
  ├── Workspace Members (collaboration)
  └── Documents
       ├── Document Chunks (with embeddings)
       ├── Document Insights (AI analysis)
       └── Knowledge Edges (relationships)

Search History (analytics)
```

---

## 🔐 Security Features

✅ **Row-Level Security (RLS)** - Data isolation per user
✅ **Authentication** - Supabase Auth with session cookies
✅ **Authorization** - Role-based access (owner/editor/viewer)
✅ **Encryption** - HTTPS and encrypted at rest
✅ **Input Validation** - Zod schema validation
✅ **SQL Injection Prevention** - Parameterized queries

---

## 📈 Advanced Usage

### Multi-Workspace
1. Click your profile (top right)
2. Select "All Workspaces"
3. Switch between workspaces
4. Each has isolated documents and access controls

### Collaboration
1. In workspace settings, invite team members
2. Assign roles: **Owner** (full control) or **Editor** (can upload)
3. Share insights with team
4. See who searched what in analytics

### Custom Insights
- Documents are automatically analyzed on upload
- No additional training needed
- AI learns from your document patterns over time
- Insights improve as you add more documents

### API Usage (Future)
- Generate API keys in workspace settings
- Use REST API for integrations
- Webhook support for external systems
- Batch operations for bulk uploads

---

## 🛠️ Development

### Project Structure
```
app/
  ├── api/                 # API endpoints
  │   ├── embed/          # Embedding generation
  │   ├── analyze/        # Document analysis
  │   ├── search/         # Semantic search
  │   └── knowledge-graph/# Relationship building
  ├── workspace/[id]/     # Workspace dashboard
  ├── workspaces/         # Workspace management
  └── auth/               # Authentication pages

components/
  ├── workspace/          # Workspace UI
  ├── workspaces/         # Workspace list
  ├── auth/               # Auth components
  └── ui/                 # shadcn/ui components

lib/
  ├── utils/              # Helper functions
  └── supabase/           # Database clients
```

### Running Tests
```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test -- components/__tests__/search.test.tsx

# Watch mode
pnpm test -- --watch
```

### Building for Production
```bash
# Build optimized production bundle
pnpm build

# Start production server
pnpm start
```

---

## 🚨 Troubleshooting

### "Environment variables not set"
1. Check `.env.local` has NEXT_PUBLIC_SUPABASE_URL
2. Restart dev server: `pnpm dev`
3. Clear `.next` cache: `rm -rf .next`

### "Embeddings failed to generate"
1. Check OpenAI API key is valid
2. Check API rate limits not exceeded
3. Check document size (max 128,000 tokens)

### "Search returning no results"
1. Ensure document is indexed (check `is_indexed` field)
2. Try different search terms
3. Check RLS policies allow access

### "Slow search performance"
1. Check HNSW index exists on pgvector
2. Reduce chunk size if indexing huge documents
3. Use keyword search as fallback

---

## 📚 Learn More

- **README.md** - Feature overview
- **ARCHITECTURE.md** - Technical deep dive
- **FEATURES.md** - Detailed feature specs
- **SETUP.md** - Deployment guide
- **FILE_MANIFEST.md** - Complete file inventory

---

## 🎯 Next Steps

1. **Upload Documents** - Start with 2-3 documents
2. **Experiment with Search** - Try different query types
3. **Review Insights** - Check auto-generated tags and summaries
4. **Explore Analytics** - See patterns in your search behavior
5. **Invite Team** - Add collaborators to workspace
6. **Customize Tags** - Create your own tagging system
7. **Monitor Performance** - Track search effectiveness

---

## 🤝 Support

Issues or questions? 
- Check documentation files in the project root
- Review API route implementations for details
- Check database schema in ARCHITECTURE.md
- Review component props and usage examples

---

**Keen Document Intelligence Platform v1.0**
*Transform your documents into actionable intelligence*
