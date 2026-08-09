import { createClient } from "@supabase/supabase-js";

import {
  generateEmbedding,
} from "./embeddings";

export interface SearchResult {
  id: string;
  documentId: string;
  workspaceId: string;
  content: string;
  chunkIndex: number;
  similarity: number;
}

export interface SearchOptions {
  workspaceId: string;
  query: string;
  limit?: number;
  matchThreshold?: number;
}

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL is not configured.",
  );
}

if (!supabaseServiceRoleKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is not configured.",
  );
}

/**
 * Server-side Supabase client.
 *
 * The service-role key must NEVER be exposed
 * to the browser.
 */
const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

/**
 * Search document chunks using vector similarity.
 */
export async function searchKnowledgeBase({
  workspaceId,
  query,
  limit = 8,
  matchThreshold = 0.35,
}: SearchOptions): Promise<SearchResult[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  if (!workspaceId) {
    throw new Error(
      "workspaceId is required.",
    );
  }

  // Generate an embedding for the user's question.
  const embedding =
    await generateEmbedding(
      normalizedQuery,
    );

  // Search the vector database.
  const { data, error } =
    await supabase.rpc(
      "match_document_chunks",
      {
        query_embedding: embedding,
        match_workspace_id: workspaceId,
        match_threshold: matchThreshold,
        match_count: limit,
      },
    );

  if (error) {
    throw new Error(
      `Vector search failed: ${error.message}`,
    );
  }

  if (!data) {
    return [];
  }

  return data.map(
    (row: {
      id: string;
      document_id: string;
      workspace_id: string;
      content: string;
      chunk_index: number;
      similarity: number;
    }) => ({
      id: row.id,
      documentId: row.document_id,
      workspaceId: row.workspace_id,
      content: row.content,
      chunkIndex: row.chunk_index,
      similarity: row.similarity,
    }),
  );
}