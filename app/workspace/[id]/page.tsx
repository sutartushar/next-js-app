'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Upload, Search, BarChart3, FileText, Zap } from 'lucide-react';
import DocumentUpload from '@/components/workspace/document-upload';
import SemanticSearch from '@/components/workspace/semantic-search';
import DocumentList from '@/components/workspace/document-list';
import WorkspaceHeader from '@/components/workspace/workspace-header';

interface Workspace {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface Document {
  id: string;
  title: string;
  created_at: string;
  is_indexed: boolean;
}

export default function WorkspacePage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'documents' | 'search'>('documents');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/login');
          return;
        }

        // Load workspace
        const { data: workspaceData } = await supabase
          .from('workspaces')
          .select('id, name, description, created_at')
          .eq('id', workspaceId)
          .single();

        if (workspaceData) {
          setWorkspace(workspaceData);
        }

        // Load documents
        const { data: docsData } = await supabase
          .from('documents')
          .select('id, title, created_at, is_indexed')
          .eq('workspace_id', workspaceId)
          .order('created_at', { ascending: false });

        if (docsData) {
          setDocuments(docsData);
        }
      } catch (error) {
        console.error('[v0] Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [workspaceId, supabase, router]);

  const handleDocumentUploaded = (newDoc: Document) => {
    setDocuments([newDoc, ...documents]);
    setShowUploadDialog(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-20 bg-card border-b border-border animate-pulse" />
        <div className="container mx-auto px-4 py-12">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Workspace not found</p>
          <Button onClick={() => router.push('/workspaces')}>Back to Workspaces</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <WorkspaceHeader workspace={workspace} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Documents</p>
                <p className="text-3xl font-bold text-foreground">{documents.length}</p>
              </div>
              <FileText className="w-10 h-10 text-primary/30" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Indexed</p>
                <p className="text-3xl font-bold text-foreground">
                  {documents.filter((d) => d.is_indexed).length}
                </p>
              </div>
              <Zap className="w-10 h-10 text-accent/30" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Intelligence</p>
                <p className="text-3xl font-bold text-foreground">
                  {Math.round((documents.filter((d) => d.is_indexed).length / Math.max(documents.length, 1)) * 100)}%
                </p>
              </div>
              <BarChart3 className="w-10 h-10 text-secondary/30" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'documents'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Documents
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'search'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Search className="w-4 h-4 inline mr-2" />
            Semantic Search
          </button>
        </div>

        {/* Content */}
        {activeTab === 'documents' ? (
          <div className="space-y-6">
            <div className="flex gap-2">
              <Button
                onClick={() => setShowUploadDialog(true)}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Document
              </Button>
            </div>
            <DocumentList documents={documents} workspaceId={workspaceId} />
          </div>
        ) : (
          <SemanticSearch workspaceId={workspaceId} />
        )}
      </main>

      {/* Upload Dialog */}
      <DocumentUpload
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        workspaceId={workspaceId}
        onSuccess={handleDocumentUploaded}
      />
    </div>
  );
}
