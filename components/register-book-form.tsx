"use client"

import type React from "react"

import { useState } from "react"
import { BookOpen, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export function RegisterBookForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    author: "",
    copies: 1,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al registrar el libro")
      }

      const data = await response.json()

      toast({
        title: "¡Libro registrado con éxito!",
        description: `${data.title} ha sido añadido al grimorio con ${data.copies.length} ejemplares.`,
      })

      setFormData({ isbn: "", title: "", author: "", copies: 1 })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo registrar el libro",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-8 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-sans font-bold">Registrar Nuevo Libro</h2>
          <p className="text-muted-foreground">Añade un nuevo tomo al grimorio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="isbn">ISBN</Label>
          <Input
            id="isbn"
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            placeholder="978-84-08-18123-4"
            required
            maxLength={250}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Harry Potter y la Piedra Filosofal"
            required
            maxLength={250}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Autor</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="J.K. Rowling"
            required
            maxLength={250}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="copies">Cantidad de Ejemplares</Label>
          <Input
            id="copies"
            type="number"
            min={1}
            value={formData.copies}
            onChange={(e) => setFormData({ ...formData, copies: Number.parseInt(e.target.value) || 1 })}
            required
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            "Registrando..."
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Registrar Libro
            </>
          )}
        </Button>
      </form>
    </Card>
  )
}
