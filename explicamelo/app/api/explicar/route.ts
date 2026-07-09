import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const NIVELES = {
  peque: {
    label: "Peque (5-10 años)",
    instruccion:
      "Explica como a un niño de entre 5 y 10 años: frases muy cortas, vocabulario sencillo, una analogía cotidiana (juguetes, animales, comida). Evita cualquier detalle perturbador, violento o sexual; si el tema es sensible, trátalo con cuidado y desde una perspectiva segura y apropiada para la edad.",
  },
  adolescente: {
    label: "Adolescente",
    instruccion:
      "Explica como a un adolescente de secundaria: claro, algo más técnico, puedes usar ejemplos de redes sociales, videojuegos o clase, sin infantilizar.",
  },
  experto: {
    label: "Experto",
    instruccion:
      "Explica con precisión técnica, terminología correcta del campo, matices y limitaciones del tema, como si hablaras con alguien con formación universitaria en el área.",
  },
} as const;

type Nivel = keyof typeof NIVELES;

export async function POST(req: NextRequest) {
  try {
    const { tema, nivel, idioma, apiKey: apiKeyCliente } = await req.json();

    if (!tema || typeof tema !== "string" || tema.trim().length === 0) {
      return NextResponse.json(
        { error: "Falta el tema a explicar." },
        { status: 400 }
      );
    }

    const nivelKey: Nivel = (["peque", "adolescente", "experto"] as const).includes(
      nivel
    )
      ? nivel
      : "adolescente";

    const idiomaFinal = idioma && typeof idioma === "string" ? idioma : "español";

    // Prioridad: API key que el usuario pegó en la barrita > variable de entorno del servidor.
    const apiKey =
      (typeof apiKeyCliente === "string" && apiKeyCliente.trim()) ||
      process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Falta la API key de Groq. Pégala en la barrita de arriba o configura GROQ_API_KEY en el servidor.",
        },
        { status: 400 }
      );
    }

    const systemPrompt = `Eres "Explícamelo", un asistente que explica cualquier tema de forma clara y honesta.
Responde SIEMPRE en ${idiomaFinal}.
Nivel solicitado: ${NIVELES[nivelKey].label}. ${NIVELES[nivelKey].instruccion}

Devuelve EXCLUSIVAMENTE un objeto JSON válido (sin texto adicional, sin markdown, sin backticks) con esta forma exacta:
{
  "titulo": string,               // título corto del tema
  "explicacion": string,          // 2-4 párrafos explicando el tema al nivel pedido
  "analogia": string,             // una analogía breve que ayude a entenderlo
  "puntos_clave": string[],       // 3 a 5 puntos clave en frases cortas
  "fuentes_sugeridas": string[],  // 2-4 tipos de fuentes fiables para profundizar (ej. "Enciclopedia Británica", "paper de revisión en Nature"), no inventes URLs falsas
  "quiz": [
    {
      "pregunta": string,
      "opciones": string[4],
      "respuesta_correcta": number // índice 0-3
    }
  ] // exactamente 3 preguntas
}`;

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.6,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Tema a explicar: ${tema.trim()}` },
          ],
        }),
      }
    );

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      return NextResponse.json(
        { error: `Error de Groq (${groqRes.status}): ${errText}` },
        { status: 502 }
      );
    }

    const data = await groqRes.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Groq no devolvió contenido." },
        { status: 502 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "No se pudo interpretar la respuesta del modelo como JSON." },
        { status: 502 }
      );
    }

    return NextResponse.json({ resultado: parsed });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Error desconocido en el servidor." },
      { status: 500 }
    );
  }
}
