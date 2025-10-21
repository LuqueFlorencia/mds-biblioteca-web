"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { BookMarked, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ResultModal } from "@/components/result-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api, type Person, type AvailableBook } from "@/lib/api"

export function CreateLoanForm() {
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalDescription, setModalDescription] = useState("")

  const [socios, setSocios] = useState<Person[]>([])
  const [bibliotecarios, setBibliotecarios] = useState<Person[]>([])
  const [availableBooks, setAvailableBooks] = useState<AvailableBook[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const [formData, setFormData] = useState({
    memberId: "",
    librarianId: "",
    bookId: "",
    dateFrom: "",
    dateTo: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sociosData, bibliotecariosData, booksData] = await Promise.all([
          api.people.getAllSocios(),
          api.people.getAllBibliotecarios(),
          api.books.getAvailableBooks(),
        ])
        setSocios(sociosData)
        setBibliotecarios(bibliotecariosData)
        setAvailableBooks(booksData)
      } catch (error) {
        setModalSuccess(false)
        setModalTitle("Error al cargar datos")
        setModalDescription("No se pudieron cargar los datos necesarios")
        setModalOpen(true)
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const selectedBook = availableBooks.find((book) => book.id.toString() === formData.bookId)
      if (!selectedBook || selectedBook.availableCopies.length === 0) {
        throw new Error("No hay copias disponibles para este libro")
      }

      const copyId = selectedBook.availableCopies[0].id

      const data = await api.loans.create({
        memberId: Number.parseInt(formData.memberId),
        librarianId: Number.parseInt(formData.librarianId),
        copyId: copyId,
        dateFrom: new Date(formData.dateFrom).toISOString(),
        dateTo: new Date(formData.dateTo).toISOString(),
      })

      setModalSuccess(true)
      setModalTitle("¡Préstamo registrado con éxito!")
      setModalDescription(`El libro ha sido prestado correctamente. ID del préstamo: ${data.id}`)
      setModalOpen(true)

      setFormData({
        memberId: "",
        librarianId: "",
        bookId: "",
        dateFrom: "",
        dateTo: "",
      })

      // Refresh available books
      const booksData = await api.books.getAvailableBooks()
      setAvailableBooks(booksData)
    } catch (error) {
      setModalSuccess(false)
      setModalTitle("Error al crear préstamo")
      setModalDescription(error instanceof Error ? error.message : "No se pudo crear el préstamo")
      setModalOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card className="p-8 bg-card/85 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <BookMarked className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-sans font-bold">Nuevo Préstamo</h2>
            <p className="text-muted-foreground">Registra un préstamo de libro</p>
          </div>
        </div>

        {loadingData ? (
        <div className="text-center py-8 text-xl text-primary font-bold">Cargando datos...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="memberId">Socio</Label>
              <Select
                value={formData.memberId}
                onValueChange={(value) => setFormData({ ...formData, memberId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un socio" />
                </SelectTrigger>
                <SelectContent>
                  {socios.map((socio) => (
                    <SelectItem key={socio.id} value={socio.id.toString()}>
                      {socio.id} - {socio.lastname}, {socio.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="librarianId">Bibliotecario</Label>
              <Select
                value={formData.librarianId}
                onValueChange={(value) => setFormData({ ...formData, librarianId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un bibliotecario" />
                </SelectTrigger>
                <SelectContent>
                  {bibliotecarios.map((bibliotecario) => (
                    <SelectItem key={bibliotecario.id} value={bibliotecario.id.toString()}>
                      {bibliotecario.id} - {bibliotecario.lastname}, {bibliotecario.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bookId">Libro Disponible</Label>
              <Select value={formData.bookId} onValueChange={(value) => setFormData({ ...formData, bookId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un libro" />
                </SelectTrigger>
                <SelectContent>
                  {availableBooks.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">No hay libros disponibles</div>
                  ) : (
                    availableBooks.map((book) => (
                      <SelectItem key={book.id} value={book.id.toString()}>
                        {book.title} - {book.author} ({book.availableCount} disponibles)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFrom">Fecha de Inicio</Label>
              <Input
                id="dateFrom"
                type="datetime-local"
                value={formData.dateFrom}
                onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTo">Fecha de Devolución</Label>
              <Input
                id="dateTo"
                type="datetime-local"
                value={formData.dateTo}
                onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                "Registrando..."
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Crear Préstamo
                </>
              )}
            </Button>
          </form>
        )}
      </Card>

      <ResultModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        success={modalSuccess}
        title={modalTitle}
        description={modalDescription}
      />
    </>
  )
}
