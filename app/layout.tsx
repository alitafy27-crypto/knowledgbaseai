import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";

const GA_MEASUREMENT_ID = "G-PKT2BJEPDE";

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
    <html lang="en">
      <body>
        {children}

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}