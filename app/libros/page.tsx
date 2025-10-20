"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RegisterBookForm } from "@/components/register-book-form"
import { SearchBooks } from "@/components/search-books"

export default function LibrosPage() {
  const [activeTab, setActiveTab] = useState<"search" | "register">("search")

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-sans font-bold">Grimorio de Libros</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 max-w-4xl mx-auto">
          <Button
            variant={activeTab === "search" ? "default" : "outline"}
            onClick={() => setActiveTab("search")}
            className="flex-1"
          >
            <Search className="w-4 h-4 mr-2" />
            Buscar Libros
          </Button>
          <Button
            variant={activeTab === "register" ? "default" : "outline"}
            onClick={() => setActiveTab("register")}
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            Registrar Libro
          </Button>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">{activeTab === "search" ? <SearchBooks /> : <RegisterBookForm />}</div>
      </div>
    </div>
  )
}
