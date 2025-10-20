# Biblioteca Mágica - Frontend

Sistema de gestión de biblioteca con un diseño mágico y de fantasía.

## Características

- **Gestión de Libros**: Registra nuevos libros y consulta su disponibilidad
- **Préstamos**: Crea préstamos y registra devoluciones con multas por daños
- **Socios**: Registra nuevos socios y bibliotecarios
- **Diseño Mágico**: Interfaz con temática de fantasía y elementos encantados

## Configuración

1. Copia el archivo `.env.local.example` a `.env.local`:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

2. Configura la URL de tu backend en `.env.local`:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:3000
\`\`\`

3. Instala las dependencias:
\`\`\`bash
npm install
\`\`\`

4. Inicia el servidor de desarrollo:
\`\`\`bash
npm run dev
\`\`\`

## Endpoints del Backend

El frontend consume los siguientes endpoints:

### Libros
- `POST /book` - Registrar nuevo libro
- `GET /book` - Buscar libros
- `GET /book/:id` - Consultar disponibilidad

### Préstamos
- `POST /loan` - Crear préstamo
- `POST /loan/:id/devolucion` - Registrar devolución
- `POST /loan/:id/pagarDeuda` - Pagar deuda

### Personas
- `POST /person/socio` - Registrar socio
- `POST /person/bibliotecario` - Registrar bibliotecario
- `GET /person/:id/deudas` - Listar deudas

## Tecnologías

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
