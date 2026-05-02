/**
 * API route for generating embeddings using AI SDK
 * Creates vector embeddings for document chunks for semantic search
 */

import { embed } from 'ai';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { texts } = await request.json();

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return Response.json({ error: 'No texts provided' }, { status: 400 });
    }

    // Generate embeddings for all texts
    const embeddings = await Promise.all(
      texts.map(async (text: string) => {
        const { embedding } = await embed({
          model: 'openai/text-embedding-3-small',
          value: text,
        });
        return embedding;
      }),
    );

    return Response.json({ embeddings });
  } catch (error) {
    console.error('[v0] Embedding error:', error);
    return Response.json(
      { error: 'Failed to generate embeddings' },
      { status: 500 },
    );
  }
}
