interface Chunk {
  content: string;
  chunkIndex: number;
}

export function chunkText(text: string, chunkSize: number = 1000, overlap: number = 150): Chunk[] {
  const chunks: Chunk[] = [];
  let index = 0;

  while (index < text.length) {
    let end = index + chunkSize;
    // لتجنب قطع الكلمات
    if (end < text.length && text[end] !== ' ' && text[end - 1] !== ' ') {
      const lastSpace = text.lastIndexOf(' ', end);
      if (lastSpace > index) {
        end = lastSpace + 1;
      }
    }

    const chunkContent = text.substring(index, Math.min(end, text.length));
    chunks.push({
      content: chunkContent,
      chunkIndex: chunks.length,
    });

    index += chunkSize - overlap;
    if (index >= text.length) break;
  }

  return chunks;
}