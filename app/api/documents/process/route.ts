import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

import { chunkText } from "@/lib/rag/chunk";
import { generateEmbeddings } from "@/lib/rag/embeddings";

export const runtime = "nodejs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
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
 * This client uses the service-role key and therefore
 * must only be used on the server.
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

const STORAGE_BUCKET = "documents";

/**
 * Extract text from a stored document.
 */
async function extractText(
  buffer: Buffer,
  mimeType: string | null,
  fileName: string,
): Promise<string> {
  const normalizedMimeType =
    (mimeType ?? "").toLowerCase();

  const extension =
    fileName
      .split(".")
      .pop()
      ?.toLowerCase() ?? "";

  // ----------------------------------------------------------
  // TXT / Markdown
  // ----------------------------------------------------------

  if (
    normalizedMimeType.startsWith("text/") ||
    extension === "txt" ||
    extension === "md" ||
    extension === "markdown"
  ) {
    return buffer.toString("utf-8");
  }

  // ----------------------------------------------------------
  // PDF
  // ----------------------------------------------------------

  if (
    normalizedMimeType === "application/pdf" ||
    extension === "pdf"
  ) {
    const result = await pdfParse(buffer);

    return result.text;
  }

  // ----------------------------------------------------------
  // DOCX
  // ----------------------------------------------------------

  if (
    normalizedMimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    extension === "docx"
  ) {
    const result =
      await mammoth.extractRawText({
        buffer,
      });

    return result.value;
  }

  throw new Error(
    `Unsupported file type: ${mimeType ?? extension}`,
  );
}

/**
 * Check whether the authenticated user belongs
 * to the requested workspace.
 */
async function userCanAccessWorkspace(
  userId: string,
  workspaceId: string,
): Promise<boolean> {
  const { data, error } =
    await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("workspace_id", workspaceId)
      .eq("user_id", userId)
      .maybeSingle();

  if (error) {
    throw new Error(
      `Workspace access check failed: ${error.message}`,
    );
  }

  return Boolean(data);
}

/**
 * POST /api/documents/process
 *
 * Body:
 * {
 *   "documentId": "uuid"
 * }
 */
export async function POST(
  request: NextRequest,
) {
  let documentId: string | undefined;

  try {
    // --------------------------------------------------------
    // 1. Authenticate user
    // --------------------------------------------------------

    const authorization =
      request.headers.get("authorization");

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    const accessToken =
      authorization.substring(7).trim();

    if (!accessToken) {
      return NextResponse.json(
        {
          error: "Missing access token.",
        },
        {
          status: 401,
        },
      );
    }

    const {
      data: {
        user,
      },
      error: authError,
    } = await supabase.auth.getUser(
      accessToken,
    );

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "Invalid or expired session.",
        },
        {
          status: 401,
        },
      );
    }

    // --------------------------------------------------------
    // 2. Read request body
    // --------------------------------------------------------

    const body = await request.json();

    documentId =
      typeof body.documentId === "string"
        ? body.documentId.trim()
        : undefined;

    if (!documentId) {
      return NextResponse.json(
        {
          error: "documentId is required.",
        },
        {
          status: 400,
        },
      );
    }

    // --------------------------------------------------------
    // 3. Load document
    // --------------------------------------------------------

    const {
      data: document,
      error: documentError,
    } = await supabase
      .from("documents")
      .select(
        `
          id,
          workspace_id,
          knowledge_base_id,
          name,
          original_name,
          file_path,
          file_type,
          mime_type,
          file_size,
          status,
          content
        `,
      )
      .eq("id", documentId)
      .maybeSingle();

    if (documentError) {
      return NextResponse.json(
        {
          error: `Failed to load document: ${documentError.message}`,
        },
        {
          status: 500,
        },
      );
    }

    if (!document) {
      return NextResponse.json(
        {
          error: "Document not found.",
        },
        {
          status: 404,
        },
      );
    }

    // --------------------------------------------------------
    // 4. Verify workspace access
    // --------------------------------------------------------

    const hasAccess =
      await userCanAccessWorkspace(
        user.id,
        document.workspace_id,
      );

    if (!hasAccess) {
      return NextResponse.json(
        {
          error:
            "You do not have access to this workspace.",
        },
        {
          status: 403,
        },
      );
    }

    // --------------------------------------------------------
    // 5. Validate storage path
    // --------------------------------------------------------

    if (!document.file_path) {
      return NextResponse.json(
        {
          error:
            "This document does not have a storage path.",
        },
        {
          status: 400,
        },
      );
    }

    // --------------------------------------------------------
    // 6. Mark document as processing
    // --------------------------------------------------------

    await supabase
      .from("documents")
      .update({
        status: "processing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", documentId);

    // --------------------------------------------------------
    // 7. Download original file from Storage
    // --------------------------------------------------------

    const {
      data: file,
      error: downloadError,
    } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(document.file_path);

    if (downloadError || !file) {
      throw new Error(
        `Failed to download document: ${
          downloadError?.message ??
          "File not found in storage."
        }`,
      );
    }

    // --------------------------------------------------------
    // 8. Convert Blob to Buffer
    // --------------------------------------------------------

    const arrayBuffer =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(arrayBuffer);

    // --------------------------------------------------------
    // 9. Extract text
    // --------------------------------------------------------

    const extractedText =
      await extractText(
        buffer,
        document.mime_type,
        document.original_name ??
          document.name,
      );

    const normalizedText =
      extractedText.trim();

    if (!normalizedText) {
      throw new Error(
        "No readable text was found in this document.",
      );
    }

    // --------------------------------------------------------
    // 10. Split document into chunks
    // --------------------------------------------------------

    const chunks = chunkText(
      normalizedText,
      {
        chunkSize: 4000,
        overlap: 500,
        minChunkSize: 100,
      },
    );

    if (chunks.length === 0) {
      throw new Error(
        "The document could not be divided into chunks.",
      );
    }

    // --------------------------------------------------------
    // 11. Remove previous chunks
    //
    // This allows a document to be processed again
    // without creating duplicate vectors.
    // --------------------------------------------------------

    const {
      error: deleteChunksError,
    } = await supabase
      .from("document_chunks")
      .delete()
      .eq("document_id", documentId);

    if (deleteChunksError) {
      throw new Error(
        `Failed to remove old chunks: ${deleteChunksError.message}`,
      );
    }

    // --------------------------------------------------------
    // 12. Generate embeddings
    // --------------------------------------------------------

    const chunkTexts =
      chunks.map(
        (chunk) => chunk.content,
      );

    const embeddings =
      await generateEmbeddings(
        chunkTexts,
      );

    if (
      embeddings.length !==
      chunks.length
    ) {
      throw new Error(
        "Embedding count does not match chunk count.",
      );
    }

    // --------------------------------------------------------
    // 13. Prepare database rows
    // --------------------------------------------------------

    const rows = chunks.map(
      (chunk, index) => ({
        document_id: document.id,
        workspace_id:
          document.workspace_id,
        chunk_index: chunk.index,
        content: chunk.content,
        embedding: embeddings[index],
      }),
    );

    // --------------------------------------------------------
    // 14. Insert chunks in batches
    // --------------------------------------------------------

    const BATCH_SIZE = 50;

    for (
      let start = 0;
      start < rows.length;
      start += BATCH_SIZE
    ) {
      const batch = rows.slice(
        start,
        start + BATCH_SIZE,
      );

      const {
        error: insertError,
      } = await supabase
        .from("document_chunks")
        .insert(batch);

      if (insertError) {
        throw new Error(
          `Failed to insert document chunks: ${insertError.message}`,
        );
      }
    }

    // --------------------------------------------------------
    // 15. Update document
    // --------------------------------------------------------

    const {
      error: updateError,
    } = await supabase
      .from("documents")
      .update({
        content: normalizedText,
        status: "indexed",
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", documentId);

    if (updateError) {
      throw new Error(
        `Failed to update document status: ${updateError.message}`,
      );
    }

    // --------------------------------------------------------
    // 16. Success
    // --------------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        documentId: document.id,
        status: "indexed",
        chunks: chunks.length,
        characters:
          normalizedText.length,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Document processing error:",
      error,
    );

    // --------------------------------------------------------
    // Mark document as failed
    // --------------------------------------------------------

    if (documentId) {
      await supabase
        .from("documents")
        .update({
          status: "failed",
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", documentId);
    }

    const message =
      error instanceof Error
        ? error.message
        : "Failed to process document.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}