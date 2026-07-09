"use client";

type Nivel = "peque" | "adolescente" | "experto";

const NIVELES: { key: Nivel; label: string; icono: string; hint: string }[] = [
  { key: "peque", label: "Peque", icono: "◕‿◕", hint: "5–10 años" },
  { key: "adolescente", label: "Adolescente", icono: "◔ ◔", hint: "Secundaria" },
  { key: "experto", label: "Experto", icono: "⚙", hint: "Nivel técnico" },
];

export default function LevelSelector({
  value,
  onChange,
}: {
  value: Nivel;
  onChange: (v: Nivel) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {NIVELES.map((n) => {
        const active = n.key === value;
        return (
          <button
            key={n.key}
            type="button"
            onClick={() => onChange(n.key)}
            aria-pressed={active}
            className={[
              "group relative rounded-xl border-2 px-5 py-3 text-left transition-all duration-150",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-yellow",
              active
                ? "border-accent-yellow bg-board-light shadow-[0_0_0_3px_rgba(233,198,81,0.15)]"
                : "border-chalk/20 bg-board-light/40 hover:border-chalk/40",
            ].join(" ")}
          >
            <span className="block font-display text-lg text-chalk">
              {n.label}
            </span>
            <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-wide text-chalk-dim">
              {n.hint}
            </span>
            <span
              aria-hidden
              className={[
                "absolute -top-3 -right-2 text-xl transition-transform",
                active ? "scale-110" : "scale-90 opacity-60",
              ].join(" ")}
            >
              {n.icono}
            </span>
          </button>
        );
      })}
    </div>
  );
}
