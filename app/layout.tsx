import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RAGFlow AI",
    template: "%s | RAGFlow AI",
  },
  description:
    "Enterprise AI Knowledge Base powered by OpenAI, LangChain and Vector Databases.",
  keywords: [
    "AI",
    "RAG",
    "OpenAI",
    "LangChain",
    "Vector Database",
    "Knowledge Base",
    "AI Chatbot",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="hero-bg" />
        {children}
      </body>
    </html>
  );
}