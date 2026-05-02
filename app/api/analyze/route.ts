/**
 * API route for AI-powered document analysis
 * Generates summaries, extracts entities, and tags documents
 */

import { generateText } from 'ai';
import {
  generateSummary,
  extractEntities,
  extractAutoTags,
  analyzeSentiment,
} from '@/lib/utils/document';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { documentTitle, documentContent } = await request.json();

    if (!documentContent) {
      return Response.json({ error: 'No document content provided' }, { status: 400 });
    }

    // Prepare content for analysis
    const contentPreview = documentContent.substring(0, 2000);

    // Generate AI-powered summary
    const { text: aiSummary } = await generateText({
      model: 'openai/gpt-4o-mini',
      system:
        'You are a document analysis expert. Generate a concise, informative summary of the provided document.',
      prompt: `Please provide a 2-3 sentence summary of the following document:\n\nTitle: ${documentTitle || 'Untitled'}\n\nContent:\n${contentPreview}`,
      maxTokens: 150,
    });

    // Generate AI-powered topic extraction
    const { text: aiTopics } = await generateText({
      model: 'openai/gpt-4o-mini',
      system:
        'You are an expert at identifying key topics in documents. Return ONLY a JSON array of topic strings, nothing else.',
      prompt: `Extract 5-7 key topics from this document. Return as JSON array like ["topic1", "topic2"]. Document:\n\n${contentPreview}`,
      maxTokens: 100,
    });

    // Parse AI-generated topics
    let topics: string[] = [];
    try {
      const parsed = JSON.parse(aiTopics);
      topics = Array.isArray(parsed) ? parsed : [];
    } catch {
      topics = [];
    }

    // Combine with local analysis
    const summary = generateSummary(documentContent);
    const entities = extractEntities(documentContent);
    const autoTags = extractAutoTags(documentContent);
    const sentiment = analyzeSentiment(documentContent);

    return Response.json({
      summary: aiSummary || summary,
      entities,
      autoTags: [...new Set([...autoTags, ...topics])].slice(0, 15),
      sentiment,
      topics: topics.length > 0 ? topics : [],
    });
  } catch (error) {
    console.error('[v0] Analysis error:', error);
    return Response.json({ error: 'Failed to analyze document' }, { status: 500 });
  }
}
