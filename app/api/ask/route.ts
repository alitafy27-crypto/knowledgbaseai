import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase credentials for RAG search");
}

// نستخدم Service Role هنا لأن هذا البحث سيتم من داخل Server API
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface SearchOptions {
  workspaceId: string;
  query: string;
  limit?: number;
  matchThreshold?: number;
}

interface SearchResult {
  id: string;           // chunk id
  documentId: string;   // document id
  chunkIndex: number;
  content: string;
  similarity: number;
}

export async function searchKnowledgeBase({
  workspaceId,
  query,
  limit = 8,
  matchThreshold = 0.35,
}: SearchOptions): Promise<SearchResult[]> {
  try {
    // 1. توليد Embedding للسؤال (خطوة أساسية للبحث)
    // بما أن هذا الملف server-side، سنقوم باستدعاء OpenAI هنا أيضاً
    const openai = new (await import('openai')).default({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;

    // 2. استدعاء دالة Supabase RPC للبحث المتجهي
    const { data, error } = await supabase.rpc('match_document_chunks', {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: limit,
      workspace_id_param: workspaceId,
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      throw new Error(`Search failed: ${error.message}`);
    }

    // 3. ترتيب النتائج
    return (data || []).map((item: any) => ({
      id: item.id,
      documentId: item.document_id,
      chunkIndex: item.chunk_index,
      content: item.content,
      similarity: item.similarity,
    }));

  } catch (error) {
    console.error("Search Knowledge Base Error:", error);
    throw error;
  }
}