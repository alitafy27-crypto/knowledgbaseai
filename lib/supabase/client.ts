import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

/**
 * Shared Supabase browser client.
 *
 * This export is kept for modules such as the RAG/search layer
 * that import `supabase` directly.
 */
export const supabase = createClient();