# Keen Platform - Setup & Deployment Guide

## Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)
- Supabase account (free tier works)
- GitHub account (for deployment)

### Local Development (5 minutes)

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd keen

# 2. Install dependencies
pnpm install

# 3. Set up Supabase project
# - Go to https://supabase.com
# - Create new project
# - Go to Project Settings → API
# - Copy URL and ANON_KEY

# 4. Configure environment
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
EOF

# 5. Run database migrations
# Migrations are automatically applied when you access Supabase

# 6. Start development server
pnpm dev

# 7. Open http://localhost:3000
```

## Environment Variables

### Required (Supabase)
```
NEXT_PUBLIC_SUPABASE_URL          # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Public anonymous key
SUPABASE_SERVICE_ROLE_KEY         # Service role key (server-side only)
```

### Development Only
```
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### Production (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL          # Same as development
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Same as development
SUPABASE_SERVICE_ROLE_KEY         # Same as development
```

## Database Setup

### Option 1: Automatic (Recommended)
The database schema is created automatically via Supabase migrations when first deployed.

### Option 2: Manual
1. Go to Supabase Dashboard
2. SQL Editor → New Query
3. Paste the SQL from the migration applied during initial setup
4. Run the query

### Verify Setup
```bash
# Check that pgvector extension is enabled
psql $DATABASE_URL -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Check that tables were created
psql $DATABASE_URL -c "\dt public."
```

## Deployment

### Deploy to Vercel (Recommended)

```bash
# 1. Push code to GitHub
git add .
git commit -m "Initial Keen platform setup"
git push origin main

# 2. Go to https://vercel.com/new
# 3. Import your GitHub repository
# 4. Configure environment variables:
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY
#    - SUPABASE_SERVICE_ROLE_KEY

# 5. Click Deploy
# 6. Vercel will automatically:
#    - Build the Next.js app
#    - Run database migrations
#    - Deploy to CDN
#    - Set up automatic deployments on git push
```

### Custom Domain (Optional)
1. Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., keen.your-domain.com)
3. Update DNS records as instructed
4. Verify domain

### SSL/HTTPS
- Automatically handled by Vercel
- Let's Encrypt certificates
- Auto-renewal

## Development Workflow

### Project Structure
```
keen/
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── workspaces/          # Workspace management
│   ├── workspace/[id]/      # Workspace dashboard
│   └── api/                 # API routes
├── components/              # React components
├── lib/
│   ├── supabase/            # Supabase clients
│   └── utils/               # Utilities
├── public/                  # Static assets
└── docs/                    # Documentation
```

### Running Tests
```bash
# Unit tests
pnpm test

# Integration tests
pnpm test:integration

# E2E tests (with Playwright)
pnpm test:e2e
```

### Code Quality
```bash
# Lint
pnpm lint

# Type check
pnpm type-check

# Format
pnpm format
```

### Building for Production
```bash
# Build
pnpm build

# Test build locally
pnpm start

# Check bundle size
pnpm analyze
```

## Troubleshooting

### Connection Issues

**Error: "NEXT_PUBLIC_SUPABASE_URL is required"**
- Ensure .env.local is in root directory
- Restart dev server after adding env vars
- Check for typos in variable names

**Error: "Failed to fetch from Supabase"**
- Verify URL is correct (ends with .supabase.co)
- Check ANON_KEY is public, not service role key
- Ensure pgvector extension is enabled

### Authentication Issues

**Error: "Invalid redirect URL"**
- Update NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL to match your domain
- In production, ensure auth callback route is `/auth/callback`

**Error: "Failed to exchange code for session"**
- Check that /auth/callback route exists
- Verify auth configuration in Supabase dashboard

### Database Issues

**Error: "RLS policy violation"**
- This means your user doesn't have permission for this data
- Verify workspace membership in workspace_members table
- Check RLS policies in database

**Error: "Vector dimension mismatch"**
- Ensure all embeddings are 1536-dimensional (OpenAI standard)
- Don't mix embedding models

### Search Issues

**Error: "HNSW index not found"**
- Run migrations to create the index
- Check pgvector extension status

**No search results**
- Ensure documents have been indexed (is_indexed = true)
- Verify document_chunks table has entries with embeddings
- Try semantic search (not keyword search)

## Monitoring

### Vercel Dashboard
- Deployment history
- Runtime logs
- Error reporting
- Performance metrics

### Supabase Dashboard
- Database size
- API usage
- Query performance
- RLS policy violations

### Application Logs
```bash
# Local development
# Logs appear in terminal where you ran pnpm dev

# Production
# View in Vercel dashboard → Deployments → Logs
```

## Security Checklist

- [ ] Environment variables are in .env.local (not committed)
- [ ] SUPABASE_SERVICE_ROLE_KEY never exposed to client
- [ ] RLS policies verified in database
- [ ] CORS configured correctly
- [ ] HTTPS enforced in production
- [ ] Session cookies are HttpOnly & Secure
- [ ] API routes validate user authentication
- [ ] Rate limiting configured for expensive operations

## Performance Tuning

### Database
```sql
-- Check index effectiveness
ANALYZE document_chunks;
EXPLAIN ANALYZE SELECT * FROM document_chunks 
  ORDER BY embedding <-> '[...]'::vector LIMIT 10;

-- Monitor slow queries
SELECT * FROM pg_stat_statements 
WHERE mean_time > 100 
ORDER BY mean_time DESC;
```

### Frontend
- Use Next.js Image component for optimized images
- Enable static generation where possible
- Monitor Core Web Vitals in Vercel dashboard

### API
- Use streaming for long-running operations
- Implement request caching where appropriate
- Monitor API response times

## Scaling

### Horizontal Scaling
- Vercel handles automatically
- No special configuration needed
- Scales to millions of requests/month

### Vertical Scaling (Database)
- Supabase provides scaling options
- Monitor connection pool usage
- Upgrade plan if needed

### Vector Index Scaling
- HNSW performs well up to 10M+ vectors
- Monitor search latency
- Consider sharding by workspace_id if needed

## Backup & Recovery

### Automated Backups
- Supabase provides daily backups
- Retention: depends on plan
- Access through Supabase dashboard

### Manual Backups
```bash
# Export data
pg_dump $DATABASE_URL > backup.sql

# Import data
psql $DATABASE_URL < backup.sql
```

### Data Recovery
1. Go to Supabase Dashboard
2. Settings → Backups
3. Select restore point
4. Confirm recovery

## Support & Resources

### Documentation
- [Architecture Guide](./ARCHITECTURE.md)
- [API Reference](./API.md)
- [Security Docs](./SECURITY.md)

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [pgvector Docs](https://github.com/pgvector/pgvector)

### Community
- [Vercel Discord](https://vercel.com/discord)
- [Supabase Discord](https://discord.supabase.com)
- [Next.js Discussions](https://github.com/vercel/next.js/discussions)
