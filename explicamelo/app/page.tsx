"use client";

import { useEffect, useState } from "react";
import LevelSelector from "@/components/LevelSelector";
import ResultadoExplicacion, {
  Resultado,
} from "@/components/ResultadoExplicacion";

type Nivel = "peque" | "adolescente" | "experto";

const EJEMPLOS = [
  "computación cuántica",
  "inteligencia artificial",
  "cambio climático",
  "blockchain",
  "agujeros negros",
];

const LS_KEY = "explicamelo_groq_api_key";

export default function Home() {
  const [tema, setTema] = useState("");
  const [nivel, setNivel] = useState<Nivel>("adolescente");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [mostrarKey, setMostrarKey] = useState(false);

  // Carga la key guardada en el navegador (solo en el cliente)
  useEffect(() => {
    const guardada = window.localStorage.getItem(LS_KEY);
    if (guardada) setApiKey(guardada);
  }, []);

  function actualizarApiKey(v: string) {
    setApiKey(v);
    if (v.trim()) {
      window.localStorage.setItem(LS_KEY, v.trim());
    } else {
      window.localStorage.removeItem(LS_KEY);
    }
  }

  async function explicar(temaElegido?: string) {
    const t = (temaElegido ?? tema).trim();
    if (!t) return;
    if (!apiKey.trim()) {
      setError("Pega tu API key de Groq en la barrita de arriba antes de continuar.");
      return;
    }
    setCargando(true);
    setError(null);
    setResultado(null);
    try {
      const res = await fetch("/api/explicar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema: t, nivel, idioma: "español", apiKey: apiKey.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Ocurrió un error inesperado.");
      } else {
        setResultado(json.resultado);
        setTema(t);
      }
    } catch (e: any) {
      setError("No se pudo conectar con el servidor. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-sky">
          Aprende cualquier cosa, a tu manera
        </p>
        <h1 className="mt-3 font-display text-5xl leading-tight text-chalk sm:text-6xl">
          <span className="underline-scribble">Explícamelo</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-chalk/70">
          Escribe cualquier tema y recíbelo explicado a nivel Peque,
          Adolescente o Experto — con analogía, puntos clave y un quiz.
          Gratis, sin registro.
        </p>
      </header>

      <div className="mx-auto mt-8 max-w-xl">
        <label
          htmlFor="groq-key"
          className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-chalk-dim"
        >
          Tu API key de Groq
        </label>
        <div className="flex gap-2">
          <input
            id="groq-key"
            type={mostrarKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => actualizarApiKey(e.target.value)}
            placeholder="gsk_..."
            autoComplete="off"
            spellCheck={false}
            className="flex-1 rounded-lg border-2 border-chalk/20 bg-board-light/40 px-3 py-2 font-mono text-sm text-chalk placeholder:text-chalk/30 focus:border-accent-sky focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setMostrarKey((v) => !v)}
            className="shrink-0 rounded-lg border border-chalk/20 px-3 text-xs text-chalk/70 hover:border-chalk/40"
          >
            {mostrarKey ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        <p className="mt-1.5 text-[11px] text-chalk/40">
          Se guarda solo en tu navegador (localStorage), nunca en el servidor.
          Consíguela gratis en{" "}
          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dotted hover:text-chalk/70"
          >
            console.groq.com/keys
          </a>
          .
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          explicar();
        }}
        className="mt-6 space-y-6"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            placeholder="Ej. inteligencia artificial, inflación, fotosíntesis…"
            className="flex-1 rounded-lg border-2 border-chalk/20 bg-board-light/40 px-4 py-3 text-chalk placeholder:text-chalk/40 focus:border-accent-yellow focus:outline-none"
          />
          <button
            type="submit"
            disabled={cargando || !tema.trim()}
            className="rounded-lg bg-accent-yellow px-6 py-3 font-semibold text-board disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cargando ? "Pensando…" : "Explícamelo"}
          </button>
        </div>

        <LevelSelector value={nivel} onChange={setNivel} />

        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {EJEMPLOS.map((ej) => (
            <button
              key={ej}
              type="button"
              onClick={() => explicar(ej)}
              className="rounded-full border border-chalk/15 px-3 py-1 text-xs text-chalk/60 hover:border-chalk/40 hover:text-chalk/90"
            >
              {ej}
            </button>
          ))}
        </div>
      </form>

      {error && (
        <div className="mx-auto mt-8 max-w-xl rounded-lg border border-accent-coral/40 bg-accent-coral/10 p-4 text-sm text-chalk">
          {error}
        </div>
      )}

      {resultado && <ResultadoExplicacion data={resultado} />}

      <footer className="mt-24 text-center text-xs text-chalk/40">
        Contenido generado por IA con fines educativos. Verifica siempre la
        información importante con fuentes especializadas.
      </footer>
    </main>
  );
}
