"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Users, UserPlus, Library } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RegisterMemberForm } from "@/components/register-member-form"
import { RegisterLibrarianForm } from "@/components/register-librarian-form"

export default function SociosPage() {
  const [activeTab, setActiveTab] = useState<"member" | "librarian">("member")

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
              <Users className="w-8 h-8 text-secondary" />
              <h1 className="text-3xl font-sans font-bold">Comunidad Mágica</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 max-w-4xl mx-auto">
          <Button
            variant={activeTab === "member" ? "default" : "outline"}
            onClick={() => setActiveTab("member")}
            className="flex-1"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Registrar Socio
          </Button>
          <Button
            variant={activeTab === "librarian" ? "default" : "outline"}
            onClick={() => setActiveTab("librarian")}
            className="flex-1"
          >
            <Library className="w-4 h-4 mr-2" />
            Registrar Bibliotecario
          </Button>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === "member" ? <RegisterMemberForm /> : <RegisterLibrarianForm />}
        </div>
      </div>
    </div>
  )
}
