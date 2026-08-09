import OpenAI from "openai";

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  throw new Error(
    "OPENAI_API_KEY is not configured.",
  );
}

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

/**
 * OpenAI embedding model used by the RAG system.
 *
 * text-embedding-3-small produces 1536-dimensional
 * embeddings by default, matching:
 *
 * extensions.vector(1536)
 */
export const EMBEDDING_MODEL =
  "text-embedding-3-small";

/**
 * Generate an embedding for one piece of text.
 */
export async function generateEmbedding(
  text: string,
): Promise<number[]> {
  const normalizedText = text.trim();

  if (!normalizedText) {
    throw new Error(
      "Cannot generate an embedding for empty text.",
    );
  }

  const response =
    await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: normalizedText,
      encoding_format: "float",
    });

  const embedding =
    response.data[0]?.embedding;

  if (!embedding) {
    throw new Error(
      "OpenAI returned an empty embedding.",
    );
  }

  return embedding;
}

/**
 * Generate embeddings for multiple texts.
 *
 * OpenAI accepts an array of strings as input,
 * allowing us to process multiple chunks in one
 * request.
 */
export async function generateEmbeddings(
  texts: string[],
): Promise<number[][]> {
  const normalizedTexts = texts
    .map((text) => text.trim())
    .filter(Boolean);

  if (normalizedTexts.length === 0) {
    return [];
  }

  const response =
    await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: normalizedTexts,
      encoding_format: "float",
    });

  const embeddings = response.data
    .sort((a, b) => a.index - b.index)
    .map((item) => item.embedding);

  if (
    embeddings.length !==
    normalizedTexts.length
  ) {
    throw new Error(
      "OpenAI returned an unexpected number of embeddings.",
    );
  }

  return embeddings;
}