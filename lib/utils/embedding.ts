import { embed } from 'ai'

const CHUNK_SIZE = 512
const CHUNK_OVERLAP = 100

/**
 * Split text into overlapping chunks for embedding
 * Overlap helps maintain context across chunk boundaries
 */
export function chunkText(text: string, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP): Array<{ content: string; startPos: number; endPos: number }> {
  const chunks: Array<{ content: string; startPos: number; endPos: number }> = []
  const words = text.split(/\s+/)
  let currentChunk: string[] = []
  let startPos = 0
  let charCount = 0

  for (let i = 0; i < words.length; i++) {
    currentChunk.push(words[i])
    charCount += words[i].length + 1

    if (currentChunk.length >= chunkSize || i === words.length - 1) {
      const content = currentChunk.join(' ')
      const endPos = startPos + content.length

      chunks.push({ content, startPos, endPos })

      // Create overlap for next chunk
      const overlapWords = Math.ceil(overlap / 5) // Approximate word count
      currentChunk = currentChunk.slice(-overlapWords)
      startPos = endPos - (overlapWords * 5) // Approximate character position
    }
  }

  return chunks
}

/**
 * Generate embedding for text using AI SDK
 * Returns a vector of dimension 1536 (OpenAI embedding dimension)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: 'openai/text-embedding-3-small',
      value: text,
    })
    return embedding
  } catch (error) {
    console.error('[v0] Embedding generation failed:', error)
    throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Calculate cosine similarity between two vectors
 * Returns value between -1 and 1 (1 = identical, 0 = orthogonal, -1 = opposite)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have same dimension')
  }

  let dotProduct = 0
  let magA = 0
  let magB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    magA += a[i] * a[i]
    magB += b[i] * b[i]
  }

  magA = Math.sqrt(magA)
  magB = Math.sqrt(magB)

  if (magA === 0 || magB === 0) {
    return 0
  }

  return dotProduct / (magA * magB)
}

/**
 * Normalize vector to unit length
 * Improves performance for similarity search
 */
export function normalizeVector(vector: number[]): number[] {
  let magnitude = 0
  for (let i = 0; i < vector.length; i++) {
    magnitude += vector[i] * vector[i]
  }
  magnitude = Math.sqrt(magnitude)

  if (magnitude === 0) return vector

  return vector.map((v) => v / magnitude)
}

/**
 * Extract key phrases from text for initial indexing
 * Used as fallback when semantic search unavailable
 */
export function extractKeyPhrases(text: string, limit = 10): string[] {
  // Simple implementation: split by common phrase boundaries
  const phrases = text
    .split(/[.!?;:—–-]/)
    .map((p) => p.trim())
    .filter((p) => p.length > 5)
    .slice(0, limit)

  return phrases
}

/**
 * Estimate token count for text
 * Rough approximation: ~4 characters per token
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4)
}
