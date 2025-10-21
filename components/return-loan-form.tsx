"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { RotateCcw, Sparkles, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ResultModal } from "@/components/result-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api, type ActiveLoan } from "@/lib/api"

export function ReturnLoanForm() {
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalDescription, setModalDescription] = useState("")

  const [activeLoans, setActiveLoans] = useState<ActiveLoan[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const [loanId, setLoanId] = useState("")
  const [damaged, setDamaged] = useState(false)
  const [damageAmount, setDamageAmount] = useState("")

  useEffect(() => {
    const fetchActiveLoans = async () => {
      try {
        const loans = await api.loans.getActive()
        setActiveLoans(loans)
      } catch (error) {
        setModalSuccess(false)
        setModalTitle("Error al cargar datos")
        setModalDescription("No se pudieron cargar los préstamos activos")
        setModalOpen(true)
      } finally {
        setLoadingData(false)
      }
    }
    fetchActiveLoans()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await api.loans.return(
        Number.parseInt(loanId),
        damaged,
        damaged ? Number.parseFloat(damageAmount) : 0,
      )

      if (data.createdDebt) {
        setModalSuccess(true)
        setModalTitle("Devolución registrada con multa")
        setModalDescription(`Se ha registrado una deuda de $${data.createdDebt.amount} por daños al libro.`)
        setModalOpen(true)
      } else {
        setModalSuccess(true)
        setModalTitle("¡Devolución exitosa!")
        setModalDescription("El libro ha sido devuelto correctamente.")
        setModalOpen(true)
      }

      setLoanId("")
      setDamaged(false)
      setDamageAmount("")

      const loans = await api.loans.getActive()
      setActiveLoans(loans)
    } catch (error) {
      setModalSuccess(false)
      setModalTitle("Error al registrar devolución")
      setModalDescription(error instanceof Error ? error.message : "No se pudo registrar la devolución")
      setModalOpen(true)
    } finally {
      setLoading(false)
    }
  }

  const formatLoanDisplay = (loan: ActiveLoan) => {
    const dateFrom = new Date(loan.date_from).toLocaleDateString()
    return `#${loan.id} - ${loan.copy.book.title} (${loan.member.lastname}, ${loan.member.name}) - ${dateFrom}`
  }

  return (
    <>
      <Card className="p-8 bg-card/85 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <RotateCcw className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-sans font-bold">Devolver Libro</h2>
            <p className="text-muted-foreground">Registra la devolución de un préstamo</p>
          </div>
        </div>

        {loadingData ? (
          <div className="text-center py-8 text-muted-foreground">Cargando préstamos activos...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="loanId">Préstamo Activo</Label>
              <Select value={loanId} onValueChange={setLoanId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un préstamo" />
                </SelectTrigger>
                <SelectContent>
                  {activeLoans.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No hay préstamos activos
                    </SelectItem>
                  ) : (
                    activeLoans.map((loan) => (
                      <SelectItem key={loan.id} value={loan.id.toString()}>
                        {formatLoanDisplay(loan)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="damaged" checked={damaged} onCheckedChange={(checked) => setDamaged(checked as boolean)} />
              <Label
                htmlFor="damaged"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                El libro está dañado
              </Label>
            </div>

            {damaged && (
              <div className="space-y-2 p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                <div className="flex items-center gap-2 text-destructive mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-semibold">Libro dañado</span>
                </div>
                <Label htmlFor="damageAmount">Monto de la multa</Label>
                <Input
                  id="damageAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={damageAmount}
                  onChange={(e) => setDamageAmount(e.target.value)}
                  placeholder="1500.00"
                  required={damaged}
                />
              </div>
            )}

            <Button type="submit" disabled={loading || !loanId} className="w-full">
              {loading ? (
                "Registrando..."
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Registrar Devolución
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
