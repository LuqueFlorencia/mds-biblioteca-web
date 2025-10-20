"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookMarked, Plus, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateLoanForm } from "@/components/create-loan-form"
import { ReturnLoanForm } from "@/components/return-loan-form"

export default function PrestamosPage() {
  const [activeTab, setActiveTab] = useState<"create" | "return">("create")

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
              <BookMarked className="w-8 h-8 text-accent" />
              <h1 className="text-3xl font-sans font-bold">Registro de Préstamos</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 max-w-4xl mx-auto">
          <Button
            variant={activeTab === "create" ? "default" : "outline"}
            onClick={() => setActiveTab("create")}
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Préstamo
          </Button>
          <Button
            variant={activeTab === "return" ? "default" : "outline"}
            onClick={() => setActiveTab("return")}
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Devolver Libro
          </Button>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">{activeTab === "create" ? <CreateLoanForm /> : <ReturnLoanForm />}</div>
      </div>
    </div>
  )
}
