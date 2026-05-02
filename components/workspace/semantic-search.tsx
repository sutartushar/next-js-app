'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Search, AlertCircle, FileText } from 'lucide-react';

interface SearchResult {
  id: string;
  content: string;
  chunk_index: number;
  documents: {
    id: string;
    title: string;
  };
}

export default function SemanticSearch({ workspaceId }: { workspaceId: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          workspaceId,
          limit: 20,
          threshold: 0.5,
        }),
      });

      if (!res.ok) {
        throw new Error('Search failed');
      }

      const data = await res.json();
      setResults(data.results || []);
      setSearched(true);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('[v0] Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Box */}
      <form onSubmit={handleSearch} className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Search across all documents using semantic understanding..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={loading || !query.trim()}
            className="gap-2"
            size="lg"
          >
            {loading ? (
              <>
                <Spinner className="w-4 h-4" />
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Uses AI-powered semantic search to find relevant content across all documents
        </p>
      </form>

      {/* Error State */}
      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive/30">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {searched && results.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No results found
          </h3>
          <p className="text-muted-foreground mb-6">
            Try different keywords or check your documents are indexed
          </p>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Found {results.length} relevant results
            </h3>
            <p className="text-sm text-muted-foreground">
              Ordered by relevance
            </p>
          </div>

          <div className="grid gap-4">
            {results.map((result) => (
              <Card
                key={result.id}
                className="p-6 hover:shadow-lg hover:border-primary/50 transition-all"
              >
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {result.documents?.title || 'Untitled'}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Chunk {result.chunk_index + 1}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground line-clamp-3 mb-3">
                      {result.content}
                    </p>
                    <Button variant="ghost" size="sm">
                      View Document
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Initial State */}
      {!searched && results.length === 0 && (
        <Card className="p-12 text-center border-dashed">
          <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Start Searching
          </h3>
          <p className="text-muted-foreground">
            Use semantic search to find relevant content across your documents.
            The AI understands context and meaning, not just keywords.
          </p>
        </Card>
      )}
    </div>
  );
}
