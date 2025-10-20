import Link from "next/link"
import { BookOpen, Users, BookMarked, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-secondary" />
            <h1 className="text-3xl font-sans font-bold text-balance">
              Biblioteca <span className="text-primary">Mágica</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-5xl md:text-6xl font-sans font-bold text-balance leading-tight">
            Bienvenido al Reino de los{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
              Libros Encantados
            </span>
          </h2>
          <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
            Gestiona tu biblioteca con un toque de magia. Préstamos, devoluciones y más, todo en un lugar místico y
            encantador.
          </p>
        </div>
      </section>

      {/* Main Navigation Cards */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Link href="/libros" className="group">
            <Card className="p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 bg-card/50 backdrop-blur-sm h-full">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-sans font-bold">Libros</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Registra nuevos tomos mágicos y consulta su disponibilidad en la biblioteca
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/prestamos" className="group">
            <Card className="p-8 hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 bg-card/50 backdrop-blur-sm h-full">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookMarked className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-sans font-bold">Préstamos</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Gestiona préstamos y devoluciones de libros encantados
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/socios" className="group">
            <Card className="p-8 hover:border-secondary transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20 bg-card/50 backdrop-blur-sm h-full">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-sans font-bold">Socios</h3>
                <p className="text-muted-foreground leading-relaxed">Registra nuevos miembros de la comunidad mágica</p>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Hecho con magia y código
            <Sparkles className="w-4 h-4" />
          </p>
        </div>
      </footer>
    </div>
  )
}
