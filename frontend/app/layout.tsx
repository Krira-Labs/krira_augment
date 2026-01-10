import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/AuthContext"
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeProvider } from "@/components/theme-provider"
import { LenisProvider } from "@/components/lenis-provider"
import localFont from "next/font/local";
import "./globals.css"

// Load custom font with display swap for better LCP
const mokoto = localFont({
  src: "../public/fonts/Mokoto Demo.ttf",
  variable: "--font-mokoto",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Krira Augment | Enterprise-Grade RAG Infrastructure",
    template: "%s | Krira Augment",
  },
  description: "Build, deploy, and manage production-ready RAG pipelines with Krira Augment. The complete infrastructure for enterprise AI applications.",
  keywords: ["RAG", "AI", "LLM", "Machine Learning", "Enterprise AI", "Vector Database", "Chatbots", "Krira Augment"],
  authors: [{ name: "Krira Augment Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kriraaugment.com", // Adjust domain as needed
    title: "Krira Augment | Enterprise-Grade RAG Infrastructure",
    description: "Build, deploy, and manage production-ready RAG pipelines with Krira Augment.",
    siteName: "Krira Augment",
    images: [{
      url: "/og-image.png", // Ensure this exists or use a default
      width: 1200,
      height: 630,
      alt: "Krira Augment Platform",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krira Augment | Enterprise-Grade RAG Infrastructure",
    description: "Build, deploy, and manage production-ready RAG pipelines with Krira Augment.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/krira-augment-logo3.jpeg",
    shortcut: "/krira-augment-logo3.jpeg",
    apple: "/krira-augment-logo3.jpeg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${mokoto.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LenisProvider>
            <GoogleOAuthProvider clientId={googleClientId}>
              <AuthProvider>
                {children}
                <Toaster />
              </AuthProvider>
            </GoogleOAuthProvider>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
