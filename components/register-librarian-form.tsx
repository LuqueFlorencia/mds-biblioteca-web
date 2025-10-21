"use client"

import type React from "react"

import { useState } from "react"
import { Library, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ResultModal } from "@/components/result-modal"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export function RegisterLibrarianForm() {
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalDescription, setModalDescription] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    dni: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/person/bibliotecario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al registrar el bibliotecario")
      }

      const data = await response.json()

      setModalSuccess(true)
      setModalTitle("¡Bibliotecario registrado con éxito!")
      setModalDescription(
        `${data.name} ${data.lastname} ha sido añadido como guardián del conocimiento. Matrícula: ${data.enrollment_librarian}`,
      )
      setModalOpen(true)

      setFormData({ name: "", lastname: "", dni: "" })
    } catch (error) {
      setModalSuccess(false)
      setModalTitle("Error al registrar")
      setModalDescription(error instanceof Error ? error.message : "No se pudo registrar el bibliotecario")
      setModalOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card className="p-8 bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
            <Library className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h2 className="text-2xl font-sans font-bold">Registrar Nuevo Bibliotecario</h2>
            <p className="text-muted-foreground">Añade un guardián del conocimiento</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="María"
              required
              maxLength={250}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastname">Apellido</Label>
            <Input
              id="lastname"
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              placeholder="González"
              required
              maxLength={250}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dni">DNI (sin puntos)</Label>
            <Input
              id="dni"
              value={formData.dni}
              onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
              placeholder="87654321"
              required
              maxLength={9}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              "Registrando..."
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Registrar Bibliotecario
              </>
            )}
          </Button>
        </form>
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
