"use client"

import type React from "react"

import { useState } from "react"
import { UserPlus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ResultModal } from "@/components/result-modal"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export function RegisterMemberForm() {
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
      const response = await fetch(`${API_URL}/person/socio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al registrar el socio")
      }

      const data = await response.json()

      setModalSuccess(true)
      setModalTitle("¡Socio registrado con éxito!")
      setModalDescription(
        `${data.name} ${data.lastname} ha sido añadido a la comunidad mágica. Número de socio: ${data.member_id}`,
      )
      setModalOpen(true)

      setFormData({ name: "", lastname: "", dni: "" })
    } catch (error) {
      setModalSuccess(false)
      setModalTitle("Error al registrar")
      setModalDescription(error instanceof Error ? error.message : "No se pudo registrar el socio")
      setModalOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card className="p-8 bg-card/85 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h2 className="text-2xl font-sans font-bold">Registrar Nuevo Socio</h2>
            <p className="text-muted-foreground">Añade un nuevo miembro a la comunidad</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Juan"
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
              placeholder="Pérez"
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
              placeholder="12345678"
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
                Registrar Socio
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
