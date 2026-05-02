'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, FolderOpen, ArrowRight, LogOut } from 'lucide-react';
import CreateWorkspaceDialog from '@/components/workspaces/create-dialog';

interface Workspace {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/login');
          return;
        }

        // Get workspaces where user is owner or member
        const { data, error } = await supabase
          .from('workspaces')
          .select('id, name, description, created_at')
          .or(`owner_id.eq.${user.id},workspace_members.user_id.eq.${user.id}`);

        if (!error && data) {
          setWorkspaces(data);
        }
      } catch (error) {
        console.error('[v0] Error loading workspaces:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkspaces();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Keen</h1>
              <p className="text-xs text-muted-foreground">AI Document Intelligence</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Your Workspaces</h2>
            <p className="text-lg text-muted-foreground">
              Manage your document collections and collaborate with team members.
            </p>
          </div>

          {/* Create Workspace Button */}
          <div className="mb-8">
            <Button
              onClick={() => setShowCreateDialog(true)}
              size="lg"
              className="gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Workspace
            </Button>
          </div>

          {/* Workspaces Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-card rounded-lg border border-border animate-pulse"
                />
              ))}
            </div>
          ) : workspaces.length === 0 ? (
            <Card className="border-2 border-dashed border-border p-12 text-center">
              <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Workspaces Yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Create your first workspace to start managing documents with AI-powered insights.
              </p>
              <Button onClick={() => setShowCreateDialog(true)} size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Create Workspace
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces.map((workspace) => (
                <Card
                  key={workspace.id}
                  className="hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer overflow-hidden"
                  onClick={() => router.push(`/workspace/${workspace.id}`)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FolderOpen className="w-6 h-6 text-primary" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {workspace.name}
                    </h3>
                    {workspace.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {workspace.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(workspace.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Workspace Dialog */}
      <CreateWorkspaceDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {
          window.location.reload();
        }}
      />
    </div>
  );
}
