import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"

export const metadata: Metadata = {
  title: "Mutiny",
  description: "Investor & founder network",
  themeColor: "#0A0A0C",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full dark">
      <head>
        <meta name="theme-color" content="#0A0A0C" />
        <style dangerouslySetInnerHTML={{
          __html: `
            :root { 
              color-scheme: dark !important; 
              background-color: #0A0A0C !important;
            }
            html, body { 
              background-color: #0A0A0C !important; 
              margin: 0 !important;
              padding: 0 !important;
            }
            #__next, body > div {
              background-color: #0A0A0C !important;
              min-height: 100vh !important;
            }
          `
        }} />
      </head>
      <body className="min-h-screen bg-[#0A0A0C] text-white antialiased dark">
        <div style={{ backgroundColor: '#0A0A0C', minHeight: '100vh' }}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}