const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export interface Person {
  id: number
  name: string
  lastname: string
  dni: string
  enrollment_librarian: string | null
  member_id: string | null
  role_id: number
}

export interface Book {
  id: number
  isbn: string
  title: string
  author: string
}

export interface BookCopy {
  id: number
  book: Book
}

export interface ActiveLoan {
  id: number
  date_from: string
  date_to: string
  returned_at: string | null
  member: Person
  librarian: Person
  copy: BookCopy
}

export interface AvailableBook {
  id: number
  isbn: string
  title: string
  author: string
  availableCount: number
  availableCopies: Array<{ id: number }>
}

export const api = {
  // Books endpoints
  books: {
    search: async (search: string) => {
      const res = await fetch(`${API_URL}/book?search=${encodeURIComponent(search)}`)
      if (!res.ok) throw new Error("Error al buscar libros")
      const data = await res.json()
      return data.result || []
    },

    getAvailability: async (id: number) => {
      const res = await fetch(`${API_URL}/book/${id}`)
      if (!res.ok) throw new Error("Error al obtener disponibilidad")
      return res.json()
    },

    create: async (data: { isbn: string; title: string; author: string; copies: number }) => {
      const res = await fetch(`${API_URL}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Error al registrar libro")
      }
      return res.json()
    },

    getAllCopies: async (): Promise<BookCopy[]> => {
      const res = await fetch(`${API_URL}/book`)
      if (!res.ok) throw new Error("Error al obtener ejemplares")
      const data = await res.json()
      // The API returns books with their copies, we need to flatten them
      const books = data.result || []
      const copies: BookCopy[] = []
      books.forEach((book: any) => {
        if (book.copies && Array.isArray(book.copies)) {
          book.copies.forEach((copy: any) => {
            copies.push({
              id: copy.id,
              book: {
                id: book.id,
                isbn: book.isbn,
                title: book.title,
                author: book.author,
              },
            })
          })
        }
      })
      return copies
    },

    getAvailableCopies: async (search = "", limit = 50, offset = 0): Promise<BookCopy[]> => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      })
      if (search) {
        params.append("search", search)
      }
      const res = await fetch(`${API_URL}/book/available?${params.toString()}`)
      if (!res.ok) throw new Error("Error al obtener ejemplares disponibles")
      const data = await res.json()
      return data.result || []
    },

    getAvailableBooks: async (): Promise<AvailableBook[]> => {
      const res = await fetch(`${API_URL}/book/available?limit=50&offset=0`)
      if (!res.ok) throw new Error("Error al obtener libros disponibles")
      return res.json()
    },
  },

  // Loans endpoints
  loans: {
    create: async (data: {
      memberId: number
      librarianId: number
      copyId: number
      dateFrom: string
      dateTo: string
    }) => {
      const res = await fetch(`${API_URL}/loan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Error al crear préstamo")
      }
      const data2 = await res.json()
      return data2.result
    },

    getActive: async (): Promise<ActiveLoan[]> => {
      const res = await fetch(`${API_URL}/loan/active`)
      if (!res.ok) throw new Error("Error al obtener préstamos activos")
      return res.json()
    },

    return: async (loanId: number, damaged = false, damageAmount = 0) => {
      const res = await fetch(`${API_URL}/loan/${loanId}/devolucion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ damaged, damageAmount }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Error al devolver libro")
      }
      const data = await res.json()
      return data.result
    },

    payDebt: async (debtId: number) => {
      const res = await fetch(`${API_URL}/loan/${debtId}/pagarDeuda`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Error al pagar deuda")
      }
      const data = await res.json()
      return data.result
    },
  },

  // People endpoints (members and librarians)
  people: {
    createMember: async (data: { name: string; lastname: string; dni: string }) => {
      const res = await fetch(`${API_URL}/person/socio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Error al crear socio")
      }
      const data2 = await res.json()
      return data2.result
    },

    createLibrarian: async (data: { name: string; lastname: string; dni: string }) => {
      const res = await fetch(`${API_URL}/person/bibliotecario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Error al crear bibliotecario")
      }
      const data2 = await res.json()
      return data2.result
    },

    getAllSocios: async (): Promise<Person[]> => {
      const res = await fetch(`${API_URL}/person/socios`)
      if (!res.ok) throw new Error("Error al obtener socios")
      return res.json()
    },

    getAllBibliotecarios: async (): Promise<Person[]> => {
      const res = await fetch(`${API_URL}/person/bibliotecarios`)
      if (!res.ok) throw new Error("Error al obtener bibliotecarios")
      return res.json()
    },

    getDebts: async (personId: number, onlyUnpaid = true) => {
      const res = await fetch(`${API_URL}/person/${personId}/deudas?onlyUnpaid=${onlyUnpaid}`)
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Error al obtener deudas")
      }
      return res.json()
    },
  },
}
