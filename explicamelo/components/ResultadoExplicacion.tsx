"use client";

import { useState } from "react";

type Pregunta = {
  pregunta: string;
  opciones: string[];
  respuesta_correcta: number;
};

export type Resultado = {
  titulo: string;
  explicacion: string;
  analogia: string;
  puntos_clave: string[];
  fuentes_sugeridas: string[];
  quiz: Pregunta[];
};

export default function ResultadoExplicacion({ data }: { data: Resultado }) {
  return (
    <div className="animate-fade-up mx-auto mt-10 max-w-2xl space-y-8">
      <header>
        <h2 className="font-display text-3xl text-accent-yellow">
          {data.titulo}
        </h2>
      </header>

      <section className="space-y-3">
        {data.explicacion.split("\n").filter(Boolean).map((p, i) => (
          <p key={i} className="leading-relaxed text-chalk/90">
            {p}
          </p>
        ))}
      </section>

      {data.analogia && (
        <section className="rounded-lg border border-accent-sky/30 bg-board-light/60 p-4">
          <p className="font-mono text-xs uppercase tracking-wide text-accent-sky">
            Analogía
          </p>
          <p className="mt-1 text-chalk/90">{data.analogia}</p>
        </section>
      )}

      {data.puntos_clave?.length > 0 && (
        <section>
          <p className="font-mono text-xs uppercase tracking-wide text-chalk-dim">
            Puntos clave
          </p>
          <ul className="mt-2 space-y-1.5">
            {data.puntos_clave.map((pt, i) => (
              <li key={i} className="flex gap-2 text-chalk/90">
                <span className="text-accent-coral">—</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.fuentes_sugeridas?.length > 0 && (
        <section>
          <p className="font-mono text-xs uppercase tracking-wide text-chalk-dim">
            Para profundizar
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {data.fuentes_sugeridas.map((f, i) => (
              <li
                key={i}
                className="rounded-full border border-chalk/20 px-3 py-1 text-xs text-chalk/80"
              >
                {f}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.quiz?.length > 0 && <Quiz preguntas={data.quiz} />}
    </div>
  );
}

function Quiz({ preguntas }: { preguntas: Pregunta[] }) {
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});

  return (
    <section className="rounded-xl border-2 border-dashed border-chalk/25 p-5">
      <p className="font-display text-xl text-chalk">Ponte a prueba</p>
      <div className="mt-4 space-y-6">
        {preguntas.map((q, qi) => {
          const elegida = respuestas[qi];
          const respondida = elegida !== undefined;
          return (
            <div key={qi}>
              <p className="mb-2 text-chalk/90">
                {qi + 1}. {q.pregunta}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {q.opciones.map((op, oi) => {
                  const esCorrecta = oi === q.respuesta_correcta;
                  let estilo =
                    "border-chalk/20 hover:border-chalk/40 text-chalk/90";
                  if (respondida) {
                    if (oi === elegida && esCorrecta)
                      estilo = "border-accent-yellow bg-accent-yellow/10 text-chalk";
                    else if (oi === elegida && !esCorrecta)
                      estilo = "border-accent-coral bg-accent-coral/10 text-chalk";
                    else if (esCorrecta)
                      estilo = "border-accent-yellow/60 text-chalk";
                  }
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={respondida}
                      onClick={() =>
                        setRespuestas((r) => ({ ...r, [qi]: oi }))
                      }
                      className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${estilo}`}
                    >
                      {op}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
