/**
 * API route for document upload and processing
 * Handles document creation, chunking, and embedding
 */

import { embed } from 'ai';
import { createClient } from '@/lib/supabase/server';
import { chunkDocument } from '@/lib/utils/document';

export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const { title, content, workspaceId, fileType, fileSize, sourceUrl } =
      await request.json();

    if (!title || !content || !workspaceId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify workspace access and user has editor role
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('id, workspace_members(role)')
      .eq('id', workspaceId)
      .single();

    if (!workspace) {
      return Response.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const isOwner = workspace.id && workspace.workspace_members?.some((m: any) => m.role === 'owner');
    if (!isOwner && workspace.id) {
      return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Create document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        workspace_id: workspaceId,
        title,
        content,
        file_type: fileType || 'text',
        file_size: fileSize,
        source_url: sourceUrl,
        is_indexed: false,
      })
      .select()
      .single();

    if (docError || !document) {
      return Response.json({ error: 'Failed to create document' }, { status: 500 });
    }

    // Chunk the document
    const chunks = chunkDocument(content);

    // Generate embeddings for chunks
    try {
      const embeddings = await Promise.all(
        chunks.map(async (chunk) => {
          const { embedding } = await embed({
            model: 'openai/text-embedding-3-small',
            value: chunk.content,
          });
          return embedding;
        }),
      );

      // Insert chunks with embeddings
      const chunkRecords = chunks.map((chunk, idx) => ({
        document_id: document.id,
        chunk_index: chunk.index,
        content: chunk.content,
        start_position: chunk.startPosition,
        end_position: chunk.endPosition,
        embedding: embeddings[idx],
      }));

      const { error: chunksError } = await supabase
        .from('document_chunks')
        .insert(chunkRecords);

      if (chunksError) {
        console.error('[v0] Chunks error:', chunksError);
      }
    } catch (embeddingError) {
      console.error('[v0] Embedding error:', embeddingError);
      // Continue even if embeddings fail
    }

    // Trigger analysis
    try {
      const analysisRes = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/analyze`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentTitle: title,
            documentContent: content.substring(0, 3000),
          }),
        },
      );

      if (analysisRes.ok) {
        const analysis = await analysisRes.json();

        // Store insights
        await supabase.from('document_insights').insert({
          document_id: document.id,
          summary: analysis.summary,
          key_entities: { entities: analysis.entities },
          auto_tags: analysis.autoTags,
          sentiment: analysis.sentiment,
          topics: { topics: analysis.topics },
        });
      }
    } catch (analysisError) {
      console.error('[v0] Analysis request error:', analysisError);
    }

    // Mark document as indexed
    await supabase.from('documents').update({ is_indexed: true }).eq('id', document.id);

    return Response.json({
      document,
      chunkCount: chunks.length,
    });
  } catch (error) {
    console.error('[v0] Upload error:', error);
    return Response.json({ error: 'Upload failed' }, { status: 500 });
  }
}
