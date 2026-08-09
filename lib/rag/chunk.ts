/**
 * Splits document text into overlapping chunks.
 *
 * The goal is to create chunks that are:
 * - Large enough to preserve context
 * - Small enough for embeddings and retrieval
 * - Overlapping so important information at chunk boundaries
 *   is not lost
 */

export interface TextChunk {
  index: number;
  content: string;
}

export interface ChunkOptions {
  /**
   * Maximum number of characters per chunk.
   * Default: 4000
   */
  chunkSize?: number;

  /**
   * Number of characters shared between consecutive chunks.
   * Default: 500
   */
  overlap?: number;

  /**
   * Minimum chunk length.
   * Very small fragments are merged with the previous chunk.
   * Default: 100
   */
  minChunkSize?: number;
}

const DEFAULT_CHUNK_SIZE = 4000;
const DEFAULT_OVERLAP = 500;
const DEFAULT_MIN_CHUNK_SIZE = 100;

/**
 * Normalize document text before chunking.
 */
export function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u0000/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Attempts to find the best breaking point inside a chunk.
 *
 * Priority:
 * 1. Paragraph
 * 2. Line
 * 3. Sentence
 * 4. Word
 */
function findBreakPoint(
  text: string,
  targetPosition: number,
  minPosition: number,
): number {
  if (targetPosition >= text.length) {
    return text.length;
  }

  const searchStart = Math.max(0, minPosition);

  // ----------------------------------------------------------
  // 1. Paragraph break
  // ----------------------------------------------------------

  const paragraphBreak = text.lastIndexOf("\n\n", targetPosition);

  if (paragraphBreak >= searchStart) {
    return paragraphBreak + 2;
  }

  // ----------------------------------------------------------
  // 2. Line break
  // ----------------------------------------------------------

  const lineBreak = text.lastIndexOf("\n", targetPosition);

  if (lineBreak >= searchStart) {
    return lineBreak + 1;
  }

  // ----------------------------------------------------------
  // 3. Sentence break
  // ----------------------------------------------------------

  const sentenceCandidates = [". ", "! ", "? ", "。", "！", "？"];

  let bestSentenceBreak = -1;

  for (const separator of sentenceCandidates) {
    const position = text.lastIndexOf(separator, targetPosition);

    if (
      position >= searchStart &&
      position > bestSentenceBreak
    ) {
      bestSentenceBreak = position + separator.length;
    }
  }

  if (bestSentenceBreak >= searchStart) {
    return bestSentenceBreak;
  }

  // ----------------------------------------------------------
  // 4. Word break
  // ----------------------------------------------------------

  const spaceBreak = text.lastIndexOf(" ", targetPosition);

  if (spaceBreak >= searchStart) {
    return spaceBreak + 1;
  }

  // ----------------------------------------------------------
  // 5. Hard break
  // ----------------------------------------------------------

  return targetPosition;
}

/**
 * Splits text into overlapping chunks.
 */
export function chunkText(
  input: string,
  options: ChunkOptions = {},
): TextChunk[] {
  const chunkSize =
    options.chunkSize ?? DEFAULT_CHUNK_SIZE;

  const overlap =
    options.overlap ?? DEFAULT_OVERLAP;

  const minChunkSize =
    options.minChunkSize ?? DEFAULT_MIN_CHUNK_SIZE;

  if (!Number.isFinite(chunkSize) || chunkSize <= 0) {
    throw new Error("chunkSize must be greater than 0.");
  }

  if (!Number.isFinite(overlap) || overlap < 0) {
    throw new Error("overlap must be 0 or greater.");
  }

  if (overlap >= chunkSize) {
    throw new Error(
      "overlap must be smaller than chunkSize.",
    );
  }

  const text = normalizeText(input);

  if (!text) {
    return [];
  }

  // Small documents don't need to be split.
  if (text.length <= chunkSize) {
    return [
      {
        index: 0,
        content: text,
      },
    ];
  }

  const chunks: TextChunk[] = [];

  let start = 0;
  let index = 0;

  while (start < text.length) {
    const targetEnd = Math.min(
      start + chunkSize,
      text.length,
    );

    const minimumEnd = Math.min(
      start + Math.floor(chunkSize * 0.5),
      text.length,
    );

    const end =
      targetEnd === text.length
        ? text.length
        : findBreakPoint(
            text,
            targetEnd,
            minimumEnd,
          );

    const content = text
      .slice(start, end)
      .trim();

    if (content.length >= minChunkSize) {
      chunks.push({
        index,
        content,
      });

      index++;
    } else if (chunks.length > 0) {
      // Merge tiny trailing fragments into the
      // previous chunk.
      chunks[chunks.length - 1].content =
        `${chunks[chunks.length - 1].content}\n\n${content}`.trim();
    } else if (content) {
      chunks.push({
        index,
        content,
      });

      index++;
    }

    if (end >= text.length) {
      break;
    }

    // Move backwards by the overlap amount.
    let nextStart = Math.max(
      0,
      end - overlap,
    );

    // Avoid starting inside a word.
    while (
      nextStart > start &&
      !/\s/.test(text[nextStart - 1])
    ) {
      nextStart--;
    }

    // Safety guard against infinite loops.
    if (nextStart <= start) {
      nextStart = end;
    }

    start = nextStart;
  }

  return chunks;
}

/**
 * Convenience function returning only chunk strings.
 */
export function splitText(
  input: string,
  options?: ChunkOptions,
): string[] {
  return chunkText(input, options).map(
    (chunk) => chunk.content,
  );
}