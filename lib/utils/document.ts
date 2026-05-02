/**
 * Document processing utilities for chunking and embedding
 */

const CHUNK_SIZE = 1000; // characters per chunk
const CHUNK_OVERLAP = 200; // overlap between chunks

export interface DocumentChunk {
  content: string;
  index: number;
  startPosition: number;
  endPosition: number;
}

/**
 * Split document content into overlapping chunks for semantic search
 */
export function chunkDocument(content: string): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  let position = 0;

  while (position < content.length) {
    const endPosition = Math.min(position + CHUNK_SIZE, content.length);
    const chunkContent = content.substring(position, endPosition);

    chunks.push({
      content: chunkContent.trim(),
      index: chunks.length,
      startPosition: position,
      endPosition: endPosition,
    });

    // Move position with overlap
    position = endPosition - CHUNK_OVERLAP;
    if (position >= content.length - CHUNK_OVERLAP) break;
  }

  return chunks;
}

/**
 * Generate a smart summary from document content
 */
export function generateSummary(content: string, maxLength: number = 200): string {
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
  let summary = '';

  for (const sentence of sentences) {
    if (summary.length + sentence.length > maxLength) break;
    summary += sentence;
  }

  return summary.trim() || content.substring(0, maxLength);
}

/**
 * Extract potential entities from text (simple pattern matching)
 */
export function extractEntities(
  content: string,
): Array<{ name: string; type: string; relevance: number }> {
  const entities: Array<{ name: string; type: string; relevance: number }> = [];

  // Simple entity extraction patterns
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const urlPattern = /https?:\/\/[^\s]+/g;
  const capitalizedPattern = /\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g;

  // Extract emails
  const emails = content.match(emailPattern) || [];
  emails.forEach((email) => {
    entities.push({ name: email, type: 'EMAIL', relevance: 0.8 });
  });

  // Extract URLs
  const urls = content.match(urlPattern) || [];
  urls.forEach((url) => {
    entities.push({ name: url, type: 'URL', relevance: 0.7 });
  });

  // Extract potential person/organization names
  const names = content.match(capitalizedPattern) || [];
  names.forEach((name) => {
    entities.push({ name, type: 'ENTITY', relevance: 0.6 });
  });

  // Remove duplicates
  const uniqueEntities = Array.from(
    new Map(entities.map((e) => [e.name, e])).values(),
  );

  return uniqueEntities.slice(0, 20); // Limit to top 20
}

/**
 * Extract auto tags from document content
 */
export function extractAutoTags(content: string): string[] {
  const tags = new Set<string>();

  // Extract words that appear frequently
  const words = content.toLowerCase().match(/\b\w+\b/g) || [];
  const wordFreq = new Map<string, number>();

  // Common stop words to ignore
  const stopWords = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'could',
    'should',
    'may',
    'might',
    'must',
    'can',
    'this',
    'that',
    'these',
    'those',
  ]);

  words.forEach((word) => {
    if (word.length > 3 && !stopWords.has(word)) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }
  });

  // Get top 10 most frequent words as tags
  const sortedWords = Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);

  sortedWords.forEach((word) => tags.add(word));

  return Array.from(tags);
}

/**
 * Analyze sentiment of content
 */
export function analyzeSentiment(content: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = [
    'good',
    'great',
    'excellent',
    'amazing',
    'wonderful',
    'perfect',
    'love',
    'best',
    'happy',
    'success',
  ];
  const negativeWords = [
    'bad',
    'terrible',
    'awful',
    'horrible',
    'poor',
    'hate',
    'worst',
    'fail',
    'failure',
    'sad',
  ];

  const lowerContent = content.toLowerCase();
  const positiveCount = positiveWords.filter((w) => lowerContent.includes(w)).length;
  const negativeCount = negativeWords.filter((w) => lowerContent.includes(w)).length;

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}
