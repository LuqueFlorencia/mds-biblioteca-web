"use client"

import { CheckCircle2, XCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ResultModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  success: boolean
  title: string
  description: string
}

export function ResultModal({ open, onOpenChange, success, title, description }: ResultModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                success ? "bg-green-500/10" : "bg-red-500/10"
              }`}
            >
              {success ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
            </div>
            <DialogTitle className="text-2xl">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end mt-4">
          <Button onClick={() => onOpenChange(false)} className="min-w-24">
            Aceptar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
