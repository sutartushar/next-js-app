/**
 * API route for semantic search using vector embeddings
 * Performs similarity search across document chunks in pgvector
 */

import { embed } from 'ai';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { query, workspaceId, limit = 10, threshold = 0.5 } = await request.json();

    if (!query || !workspaceId) {
      return Response.json({ error: 'Missing query or workspace ID' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify workspace access
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', workspaceId)
      .or(`owner_id.eq.${user.id},workspace_members.user_id.eq.${user.id}`)
      .single();

    if (!workspace) {
      return Response.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // Generate embedding for search query
    const { embedding } = await embed({
      model: 'openai/text-embedding-3-small',
      value: query,
    });

    // Perform vector similarity search using pgvector
    const { data: results, error } = await supabase.rpc('match_document_chunks', {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: limit,
      workspace_filter: workspaceId,
    });

    if (error) {
      console.error('[v0] RPC error:', error);
      // Fallback to simpler query if RPC not available
      const { data: chunks } = await supabase
        .from('document_chunks')
        .select(
          `
          id,
          content,
          document_id,
          chunk_index,
          documents(id, title, workspace_id)
        `,
        )
        .eq('documents.workspace_id', workspaceId)
        .limit(limit);

      // Log search
      await supabase.from('search_history').insert({
        workspace_id: workspaceId,
        user_id: user.id,
        query,
        results_count: chunks?.length || 0,
        execution_time_ms: 0,
      });

      return Response.json({
        results: chunks || [],
        count: chunks?.length || 0,
      });
    }

    // Log search
    await supabase.from('search_history').insert({
      workspace_id: workspaceId,
      user_id: user.id,
      query,
      results_count: results?.length || 0,
      execution_time_ms: 0,
    });

    return Response.json({
      results: results || [],
      count: results?.length || 0,
    });
  } catch (error) {
    console.error('[v0] Search error:', error);
    return Response.json({ error: 'Search failed' }, { status: 500 });
  }
}
