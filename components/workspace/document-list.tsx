'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Trash2, Eye, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  created_at: string;
  is_indexed: boolean;
}

export default function DocumentList({
  documents,
  workspaceId,
}: {
  documents: Document[];
  workspaceId: string;
}) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const supabase = createClient();

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    setDeleting(docId);
    try {
      const { error } = await supabase.from('documents').delete().eq('id', docId);

      if (!error) {
        window.location.reload();
      }
    } catch (err) {
      console.error('[v0] Delete error:', err);
    } finally {
      setDeleting(null);
    }
  };

  if (documents.length === 0) {
    return (
      <Card className="border-2 border-dashed border-border p-12 text-center">
        <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No Documents Yet
        </h3>
        <p className="text-muted-foreground">
          Upload your first document to start leveraging AI-powered insights
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {documents.map((doc) => (
        <Card
          key={doc.id}
          className="p-6 hover:shadow-md hover:border-primary/30 transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-lg mb-1 truncate">
                  {doc.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <span>
                    {new Date(doc.created_at).toLocaleDateString()} •{' '}
                    {new Date(doc.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {doc.is_indexed ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Indexed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-xs font-medium">
                      <Clock className="w-3 h-3" />
                      Indexing...
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                disabled={!doc.is_indexed}
              >
                <Eye className="w-4 h-4" />
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(doc.id)}
                disabled={deleting === doc.id}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
