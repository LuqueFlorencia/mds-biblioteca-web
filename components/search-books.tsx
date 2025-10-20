"use client"

import type React from "react"

import { useState } from "react"
import { Search, BookOpen, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

interface Book {
  id: number
  isbn: string
  title: string
  author: string
}

interface BookAvailability {
  total: number
  prestados: number
  disponibles: number
}

export function SearchBooks() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [availability, setAvailability] = useState<BookAvailability | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSelectedBook(null)
    setAvailability(null)

    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)

      const response = await fetch(`${API_URL}/book?${params}`)

      if (!response.ok) throw new Error("Error al buscar libros")

      const data = await response.json()
      setBooks(data)

      if (data.length === 0) {
        toast({
          title: "Sin resultados",
          description: "No se encontraron libros con ese criterio",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo realizar la búsqueda",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const checkAvailability = async (book: Book) => {
    setSelectedBook(book)
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/book/${book.id}`)

      if (!response.ok) throw new Error("Error al consultar disponibilidad")

      const data = await response.json()
      setAvailability(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo consultar la disponibilidad",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-sans font-bold">Buscar Libros</h2>
            <p className="text-muted-foreground">Encuentra tomos en el grimorio</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Buscar por título o ISBN</Label>
            <div className="flex gap-2">
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ingresa título o ISBN..."
              />
              <Button type="submit" disabled={loading}>
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {books.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-sans font-bold">Resultados de búsqueda</h3>
          {books.map((book) => (
            <Card
              key={book.id}
              className="p-6 bg-card/50 backdrop-blur-sm hover:border-primary transition-colors cursor-pointer"
              onClick={() => checkAvailability(book)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-sans font-bold text-lg">{book.title}</h4>
                  <p className="text-muted-foreground">{book.author}</p>
                  <p className="text-sm text-muted-foreground">ISBN: {book.isbn}</p>
                </div>
                <BookOpen className="w-6 h-6 text-primary" />
              </div>

              {selectedBook?.id === book.id && availability && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{availability.total}</p>
                      <p className="text-sm text-muted-foreground">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-accent">{availability.prestados}</p>
                      <p className="text-sm text-muted-foreground">Prestados</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{availability.disponibles}</p>
                      <p className="text-sm text-muted-foreground">Disponibles</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2">
                    {availability.disponibles > 0 ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span className="text-primary font-semibold">Disponible para préstamo</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-destructive" />
                        <span className="text-destructive font-semibold">No disponible</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
