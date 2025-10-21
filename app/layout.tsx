import type React from "react"
import type { Metadata } from "next"
import { Cinzel, Lora } from "next/font/google"
import "./globals.css"

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Biblioteca Mágica",
  description: "Sistema de gestión de biblioteca con un toque de magia",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${cinzel.variable} ${lora.variable}`}>
      <body className="font-serif antialiased main">{children}</body>
    </html>
  )
}
