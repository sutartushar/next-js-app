import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')
    const documentId = searchParams.get('documentId')

    if (!workspaceId) {
      return NextResponse.json({ error: 'Missing workspaceId' }, { status: 400 })
    }

    // Verify user has access to workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', workspaceId)
      .or(`owner_id.eq.${user.id},user_id.eq.${user.id}`)
      .single()

    if (workspaceError || !workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    // Fetch knowledge edges (relationships)
    let edgesQuery = supabase
      .from('knowledge_edges')
      .select('*')
      .eq('workspace_id', workspaceId)

    if (documentId) {
      edgesQuery = edgesQuery.or(`source_id.eq.${documentId},target_id.eq.${documentId}`)
    }

    const { data: edges, error: edgesError } = await edgesQuery.limit(100)

    if (edgesError) {
      console.error('[v0] Knowledge edges fetch error:', edgesError)
      return NextResponse.json({ error: 'Failed to fetch relationships' }, { status: 500 })
    }

    // Extract unique node IDs from edges
    const nodeIds = new Set<string>()
    edges?.forEach((edge) => {
      nodeIds.add(edge.source_id)
      nodeIds.add(edge.target_id)
    })

    if (nodeIds.size === 0) {
      return NextResponse.json({ nodes: [], edges: [] })
    }

    // Fetch document insights for entity data
    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select('id, title, metadata')
      .in('id', Array.from(nodeIds))

    if (docsError) {
      console.error('[v0] Documents fetch error:', docsError)
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    // Build nodes from documents and entity insights
    const nodes = documents?.map((doc) => ({
      id: doc.id,
      label: doc.title,
      type: 'document' as const,
      relevance: 0.8,
    })) || []

    // Transform edges for response
    const transformedEdges = edges?.map((edge) => ({
      source: edge.source_id,
      target: edge.target_id,
      relationship: edge.relationship_type,
      strength: edge.strength || 0.5,
    })) || []

    return NextResponse.json({
      nodes,
      edges: transformedEdges,
      metadata: {
        totalNodes: nodes.length,
        totalEdges: transformedEdges.length,
        fetchedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('[v0] Knowledge graph API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
