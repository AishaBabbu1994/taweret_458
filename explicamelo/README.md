# Explícamelo

App que explica cualquier tema al instante en tres niveles (Peque, Adolescente,
Experto), usando la API de Groq. Construida con Next.js 14 (App Router) +
Tailwind, lista para desplegar en Vercel.

> Nota: esta app está inspirada en el concepto de "explicar cualquier tema a
> distintos niveles" pero tiene marca, diseño y código propios — no es una
> copia literal de ningún sitio existente.

## 1. Consigue una API key de Groq

1. Ve a https://console.groq.com/keys
2. Crea una cuenta (gratis) y genera una API key.

**Ya no hace falta configurarla en Vercel.** La interfaz tiene una barrita
donde cada persona pega su propia API key; se guarda en su navegador
(`localStorage`) y se envía solo en cada petición a `/api/explicar`, nunca se
almacena en el servidor. Esto es ideal si vas a compartir la app con más
gente y cada quien usa su propia cuenta/cuota de Groq.

Si prefieres tener una key fija para todos los usuarios (por ejemplo, para un
uso interno), puedes seguir configurando `GROQ_API_KEY` como variable de
entorno en Vercel: el servidor la usará automáticamente como respaldo cuando
la barrita esté vacía.

## 2. Ejecutar en local (opcional)

```bash
npm install
npm run dev
```

Abre http://localhost:3000 y pega tu API key en la barrita de la parte
superior (o crea `.env.local` a partir de `.env.example` si prefieres el
método de variable de entorno).

## 3. Desplegar en Vercel

### Opción A — con la web de Vercel
1. Sube esta carpeta a un repositorio de GitHub (o usa "Import" con un ZIP
   local si tu plan lo permite).
2. Entra a https://vercel.com/new e importa el repositorio.
3. (Opcional) En "Environment Variables" añade `GROQ_API_KEY` solo si quieres
   una key de respaldo para todos los usuarios.
4. Haz clic en "Deploy".

### Opción B — con la CLI de Vercel
```bash
npm i -g vercel
vercel
vercel --prod
```

## Estructura del proyecto

```
app/
  page.tsx                → interfaz principal
  api/explicar/route.ts   → endpoint que llama a Groq (la API key nunca
                             se expone al navegador)
  layout.tsx, globals.css → layout y estilos
components/
  LevelSelector.tsx        → selector de nivel (Peque/Adolescente/Experto)
  ResultadoExplicacion.tsx → tarjeta de resultado + quiz interactivo
```

## Personalizar

- **Modelo de Groq**: cambia `"llama-3.3-70b-versatile"` en
  `app/api/explicar/route.ts` por otro modelo disponible en tu cuenta de Groq
  (por ejemplo `llama-3.1-8b-instant` para respuestas más rápidas/baratas).
- **Idiomas**: el body ya acepta un campo `idioma`; puedes añadir un selector
  de idioma en la interfaz y pasarlo al fetch.
- **Diseño**: los colores y tipografías están centralizados en
  `tailwind.config.ts` y `app/globals.css`.
