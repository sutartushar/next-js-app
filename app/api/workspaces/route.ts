import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's own workspaces and shared workspaces
    const { data: workspaces, error } = await supabase
      .from('workspaces')
      .select(
        `
        *,
        workspace_members!inner (
          user_id,
          role
        )
      `
      )
      .or(`owner_id.eq.${user.id},and(workspace_members.user_id.eq.${user.id})`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching workspaces:', error)
      // Fallback: get owner workspaces
      const { data: ownerWorkspaces, error: ownerError } = await supabase
        .from('workspaces')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

      if (ownerError) {
        return NextResponse.json({ error: ownerError.message }, { status: 500 })
      }
      return NextResponse.json(ownerWorkspaces || [])
    }

    return NextResponse.json(workspaces || [])
  } catch (error) {
    console.error('[v0] Error fetching workspaces:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Workspace name is required' },
        { status: 400 }
      )
    }

    // Create workspace
    const { data: workspace, error } = await supabase
      .from('workspaces')
      .insert({
        name,
        description: description || '',
        owner_id: user.id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(workspace, { status: 201 })
  } catch (error) {
    console.error('[v0] Error creating workspace:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
