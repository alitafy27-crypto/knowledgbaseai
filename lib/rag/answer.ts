import { openai } from "../openai";
import type { SearchResult } from "./search";

export async function generateRagAnswer(
  question: string,
  results: SearchResult[]
) {
  const context = results
    .map(
      (result, index) =>
        `SOURCE ${index + 1}\n${result.content}`
    )
    .join("\n\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: `
You are an enterprise AI knowledge assistant.

Answer the user's question using ONLY the provided knowledge base context.

Rules:
- Do not invent facts.
- If the answer is not present in the context, clearly say that you could not find the answer in the knowledge base.
- Keep the answer concise and useful.
- Use the same language as the user.
        `.trim(),
      },
      {
        role: "user",
        content: `
QUESTION:
${question}

KNOWLEDGE BASE CONTEXT:
${context || "No relevant context was found."}
        `.trim(),
      },
    ],
  });

  return (
    response.choices[0]?.message?.content?.trim() ||
    "I could not generate an answer."
  );
}