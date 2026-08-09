import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

interface ParsedDocumentResult {
  text: string;
  metadata?: any;
}

export async function parseDocument(buffer: Buffer, fileExtension: string): Promise<ParsedDocumentResult> {
  const ext = fileExtension.toLowerCase();

  switch (ext) {
    case 'pdf':
      const pdfData = await pdfParse(buffer);
      return { text: pdfData.text, metadata: { pageCount: pdfData.numpages } };
    case 'txt':
      const text = buffer.toString('utf-8');
      return { text };
    case 'docx':
      const result = await mammoth.extractRawText({ buffer });
      return { text: result.value };
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}