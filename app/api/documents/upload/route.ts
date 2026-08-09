import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

// استيراد خدمات المعالجة (تأكد من وجود هذه الملفات في المسارات الصحيحة)
import { parseDocument } from "@/lib/services/document-parser";
import { chunkText } from "@/lib/services/chunking";
import { generateEmbeddings } from "@/lib/services/embeddings";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const ALLOWED_EXTENSIONS = ["pdf", "docx", "txt", "md"];

const MIME_TYPES: Record<string, string[]> = {
  pdf: ["application/pdf"],
  docx: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  txt: ["text/plain"],
  md: [
    "text/markdown",
    "text/plain",
    "application/octet-stream",
  ],
};

function getFileExtension(fileName: string): string {
  const parts = fileName.toLowerCase().split(".");

  if (parts.length < 2) {
    return "";
  }

  return parts.pop() ?? "";
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 180);
}

function getMimeType(file: File, extension: string): string {
  if (file.type && file.type.trim() !== "") {
    return file.type;
  }

  switch (extension) {
    case "pdf":
      return "application/pdf";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "txt":
      return "text/plain";
    case "md":
      return "text/markdown";
    default:
      return "application/octet-stream";
  }
}

function isAllowedMimeType(
  extension: string,
  mimeType: string,
): boolean {
  const allowedTypes = MIME_TYPES[extension];
  if (!allowedTypes) {
    return false;
  }
  return allowedTypes.includes(mimeType);
}

export async function POST(request: Request) {
  try {
    /*
     * ---------------------------------------------------------
     * 1. Environment variables
     * ---------------------------------------------------------
     */

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabasePublishableKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_SUPABASE_URL is not configured." },
        { status: 500 }
      );
    }

    if (!supabasePublishableKey) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not configured." },
        { status: 500 }
      );
    }

    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY is not configured." },
        { status: 500 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 2. Authenticated Supabase client
     * ---------------------------------------------------------
     */

    const cookieStore = await cookies();

    const supabase = createServerClient(
      supabaseUrl,
      supabasePublishableKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {
              // In some server contexts cookies cannot be modified.
            }
          },
        },
      }
    );

    /*
     * ---------------------------------------------------------
     * 3. Get current authenticated user
     * ---------------------------------------------------------
     */

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in first." },
        { status: 401 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 4. Admin Supabase client
     * ---------------------------------------------------------
     */

    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    /*
     * ---------------------------------------------------------
     * 5. Read multipart/form-data
     * ---------------------------------------------------------
     */

    const formData = await request.formData();

    const fileValue = formData.get("file");
    const knowledgeBaseIdValue = formData.get("knowledgeBaseId");

    if (!(fileValue instanceof File)) {
      return NextResponse.json(
        { error: "No file was provided." },
        { status: 400 }
      );
    }

    if (
      typeof knowledgeBaseIdValue !== "string" ||
      !knowledgeBaseIdValue.trim()
    ) {
      return NextResponse.json(
        { error: "knowledgeBaseId is required." },
        { status: 400 }
      );
    }

    const knowledgeBaseId = knowledgeBaseIdValue.trim();

    /*
     * ---------------------------------------------------------
     * 6. Validate file size
     * ---------------------------------------------------------
     */

    if (fileValue.size === 0) {
      return NextResponse.json(
        { error: "The uploaded file is empty." },
        { status: 400 }
      );
    }

    if (fileValue.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File is too large. Maximum allowed size is 20 MB." },
        { status: 400 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 7. Validate extension
     * ---------------------------------------------------------
     */

    const originalName = fileValue.name.trim();
    const extension = getFileExtension(originalName);

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        { error: "Unsupported file type. Allowed files: PDF, DOCX, TXT and Markdown." },
        { status: 400 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 8. Validate MIME type
     * ---------------------------------------------------------
     */

    const mimeType = getMimeType(fileValue, extension);

    if (!isAllowedMimeType(extension, mimeType)) {
      return NextResponse.json(
        { error: "Invalid MIME type format. Please check your input." },
        { status: 400 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 9. Verify knowledge base
     * ---------------------------------------------------------
     */

    const {
      data: knowledgeBase,
      error: knowledgeBaseError,
    } = await supabaseAdmin
      .from("knowledge_bases")
      .select("id, workspace_id, name")
      .eq("id", knowledgeBaseId)
      .maybeSingle();

    if (knowledgeBaseError) {
      console.error("Knowledge base lookup error:", knowledgeBaseError);
      return NextResponse.json(
        { error: "Failed to verify the knowledge base." },
        { status: 500 }
      );
    }

    if (!knowledgeBase) {
      return NextResponse.json(
        { error: "Knowledge base not found." },
        { status: 404 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 10. Verify workspace membership
     * ---------------------------------------------------------
     */

    const {
      data: membership,
      error: membershipError,
    } = await supabaseAdmin
      .from("workspace_members")
      .select("workspace_id, user_id")
      .eq("workspace_id", knowledgeBase.workspace_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (membershipError) {
      console.error("Workspace membership error:", membershipError);
      return NextResponse.json(
        { error: "Failed to verify workspace access." },
        { status: 500 }
      );
    }

    if (!membership) {
      return NextResponse.json(
        { error: "You do not have access to this workspace." },
        { status: 403 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 11. Prepare file path
     * ---------------------------------------------------------
     */

    const documentId = crypto.randomUUID();
    const safeFileName = sanitizeFileName(originalName);
    const uniqueFileName = `${documentId}-${safeFileName}`;
    const filePath = `${user.id}/${knowledgeBase.id}/${uniqueFileName}`;

    /*
     * ---------------------------------------------------------
     * 12. Convert File to Buffer
     * ---------------------------------------------------------
     */

    const arrayBuffer = await fileValue.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    /*
     * ---------------------------------------------------------
     * 13. Upload to Supabase Storage
     * ---------------------------------------------------------
     */

    const bucketName = "documents";

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload the file to storage.", details: uploadError.message },
        { status: 500 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 14. Save document information in database
     * ---------------------------------------------------------
     */

    const {
      data: document,
      error: documentError,
    } = await supabaseAdmin
      .from("documents")
      .insert({
        id: documentId,
        workspace_id: knowledgeBase.workspace_id,
        knowledge_base_id: knowledgeBase.id,
        name: safeFileName,
        original_name: originalName,
        file_path: filePath,
        file_type: extension,
        mime_type: mimeType,
        file_size: fileValue.size,
        status: "processing", // تم التعديل هنا: نبدأ بـ processing فوراً لأننا سنعالجه
        content: null,
      })
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
          content,
          created_at,
          updated_at
        `
      )
      .single();

    /*
     * ---------------------------------------------------------
     * 15. Roll back Storage if database insert fails
     * ---------------------------------------------------------
     */

    if (documentError) {
      console.error("Document database insert error:", documentError);
      await supabaseAdmin.storage.from(bucketName).remove([filePath]);
      return NextResponse.json(
        { error: "File uploaded but failed to save document information.", details: documentError.message },
        { status: 500 }
      );
    }

    /* ==================================================================================
     * 16. بدء عملية المعالجة (Processing Pipeline) - الجزء الجديد المضافة
     * ================================================================================== */

    // نقوم بتشغيل العملية دون انتظارها (Fire and Forget) لتجنب Timeout طويل للمتصفح
    // في الإنتاج يفضل وضع هذا في Queue (مثل BullMQ أو Vercel Queues)
    processDocumentPipeline(documentId, filePath, supabaseAdmin).catch(console.error);

    return NextResponse.json(
      {
        success: true,
        message: "Document uploaded and processing started.",
        document,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected upload error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while uploading the document." },
      { status: 500 }
    );
  }
}

/* ==================================================================================
 * دالة المعالجة الخلفية (Background Processing)
 * ================================================================================== */

async function processDocumentPipeline(
  docId: string,
  filePath: string,
  supabaseAdmin: any
) {
  try {
    console.log(`[Processing] Starting pipeline for document: ${docId}`);

    // 1. تحميل الملف من الـ Storage
    const { data: fileData, error: dlError } = await supabaseAdmin.storage
      .from("documents")
      .download(filePath);

    if (dlError) {
      throw new Error(`Failed to download file for processing: ${dlError.message}`);
    }

    // 2. استخراج النص (Text Extraction)
    const buffer = Buffer.from(await fileData.arrayBuffer());
    const fileExt = filePath.split('.').pop() || 'txt';
    const { text } = await parseDocument(buffer, fileExt);

    // 3. تجزئة النص إلى قطع (Chunking)
    const chunks = chunkText(text, 1000, 150);

    if (chunks.length === 0) {
      throw new Error("No text content extracted from the document.");
    }

    // 4. توليد الـ Embeddings (توليد المتجهات)
    const chunkTexts = chunks.map((c) => c.content);
    const embeddings = await generateEmbeddings(chunkTexts);

    // 5. حفظ القطع والمتجهات في قاعدة البيانات
    const chunkInserts = chunks.map((chunk, index) => ({
      document_id: docId,
      content: chunk.content,
      chunk_index: chunk.chunkIndex,
      embedding: embeddings[index], // Postgres pgvector expects array
    }));

    const { error: chunkError } = await supabaseAdmin
      .from("document_chunks")
      .insert(chunkInserts);

    if (chunkError) {
      throw new Error(`Failed to save chunks: ${chunkError.message}`);
    }

    // 6. تحديث حالة المستند إلى "مكتمل"
    const { error: updateError } = await supabaseAdmin
      .from("documents")
      .update({ 
        status: "completed",
        content: text // اختياري: تخزين النص الكامل أيضاً
      })
      .eq("id", docId);

    if (updateError) {
      throw new Error(`Failed to update document status: ${updateError.message}`);
    }

    console.log(`[Processing] Completed successfully for document: ${docId}`);

  } catch (error: any) {
    console.error(`[Processing] Failed for document ${docId}:`, error);

    // في حالة الفشل، نقوم بتحديث الحالة إلى "failed" مع رسالة الخطأ
    await supabaseAdmin
      .from("documents")
      .update({
        status: "failed",
        error_message: error.message || "Processing failed",
      })
      .eq("id", docId);
  }
}