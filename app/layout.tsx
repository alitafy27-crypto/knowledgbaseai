import type { Metadata } from "next";
import "./globals.css";
// استيراد مكون Script من Next.js
import Script from "next/script";

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

        {/* 
          تم إضافة كود Google Analytics هنا باستخدام مكون Script الخاص بـ Next.js.
          هذا يضمن تحميل الكود بكفاءة عالية دون التأثير على سرعة الموقع.
        */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KZ6ZDW8SVR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KZ6ZDW8SVR');
          `}
        </Script>
      </body>
    </html>
  );
}