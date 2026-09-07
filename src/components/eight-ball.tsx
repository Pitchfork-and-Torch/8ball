import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  Check,
  History,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  Trash2,
  Dices,
} from "lucide-react";
import {
  AFFIRMATIONS,
  BAD_IDEAS,
  CLASSIC_ANSWERS,
  DARES,
  generateResult,
  MODES,
  type ModeId,
  PERMISSIONS,
} from "@/lib/content";
import { cn } from "@/lib/utils";
import { Particles } from "@/components/particles";
import { useSound } from "@/hooks/use-sound";

type HistoryItem = {
  id: string;
  mode: ModeId;
  headline: string;
  body: string;
  tone: "yes" | "no" | "maybe" | "neutral";
  at: number;
};

const STORAGE_KEY = "eightball-stats-v1";

function loadStats(): { count: number; history: HistoryItem[] } {
  if (typeof window === "undefined") return { count: 0, history: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, history: [] };
    const parsed = JSON.parse(raw) as { count?: number; history?: HistoryItem[] };
    return {
      count: parsed.count ?? 0,
      history: Array.isArray(parsed.history) ? parsed.history.slice(0, 24) : [],
    };
  } catch {
    return { count: 0, history: [] };
  }
}

function saveStats(count: number, history: HistoryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ count, history }));
  } catch {
    /* ignore */
  }
}

const TONE_RING: Record<HistoryItem["tone"], string> = {
  yes: "ring-primary/60",
  no: "ring-muted/40",
  maybe: "ring-accent/50",
  neutral: "ring-fg/20",
};

const TONE_GLOW: Record<HistoryItem["tone"], string> = {
  yes: "shadow-[0_0_60px_-12px_var(--color-primary)]",
  no: "shadow-[0_0_40px_-16px_var(--color-muted)]",
  maybe: "shadow-[0_0_50px_-12px_var(--color-accent)]",
  neutral: "shadow-[0_0_40px_-16px_var(--color-fg)]",
};

export function EightBall() {
  const [mode, setMode] = useState<ModeId>("classic");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<HistoryItem | null>(null);
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [burstKey, setBurstKey] = useState(0);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const [shaking, setShaking] = useState(false);
  const [ballShaking, setBallShaking] = useState(false);
  const [charging, setCharging] = useState(false);
  const [charge, setCharge] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [flash, setFlash] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const chargeRaf = useRef(0);
  const chargeStart = useRef(0);
  const { thump, tick, whoosh } = useSound(soundOn);

  useEffect(() => {
    const s = loadStats();
    setCount(s.count);
    setHistory(s.history);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveStats(count, history);
  }, [count, history, hydrated]);

  const fire = useCallback(
    (clientX?: number, clientY?: number) => {
      const stage = stageRef.current;
      if (stage && clientX != null && clientY != null) {
        const rect = stage.getBoundingClientRect();
        setOrigin({ x: clientX - rect.left, y: clientY - rect.top });
      } else if (stage) {
        const rect = stage.getBoundingClientRect();
        setOrigin({ x: rect.width / 2, y: rect.height * 0.52 });
      }

      setRevealing(false);
      setBallShaking(true);
      setShaking(true);
      whoosh();

      window.setTimeout(() => {
        const gen = generateResult(mode, question);
        const item: HistoryItem = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          mode,
          headline: gen.headline,
          body: gen.body,
          tone: gen.tone,
          at: Date.now(),
        };

        setResult(item);
        setCount((c) => c + 1);
        setHistory((h) => [item, ...h].slice(0, 24));
        setBurstKey((k) => k + 1);
        setFlash(true);
        setRevealing(true);
        thump();
        window.setTimeout(() => setFlash(false), 180);
      }, 320);

      window.setTimeout(() => {
        setBallShaking(false);
        setShaking(false);
      }, 500);
    },
    [mode, question, thump, whoosh],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setCharging(true);
    setCharge(0);
    chargeStart.current = performance.now();
    const loop = (now: number) => {
      const t = Math.min(1, (now - chargeStart.current) / 700);
      setCharge(t);
      if (t < 1) chargeRaf.current = requestAnimationFrame(loop);
    };
    chargeRaf.current = requestAnimationFrame(loop);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!charging) return;
    cancelAnimationFrame(chargeRaf.current);
    setCharging(false);
    setCharge(0);
    fire(e.clientX, e.clientY);
  };

  const onPointerCancel = () => {
    cancelAnimationFrame(chargeRaf.current);
    setCharging(false);
    setCharge(0);
  };

  const copyResult = async () => {
    if (!result) return;
    const text = `${result.headline}\n${result.body}\n -  8ball.grok.me`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      tick();
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setCount(0);
    setResult(null);
    setRevealing(false);
    tick();
  };

  const poolSize = useMemo(() => {
    if (mode === "permission") return PERMISSIONS.length;
    if (mode === "dare") return DARES.length;
    if (mode === "idea") return BAD_IDEAS.length;
    if (mode === "affirmation") return AFFIRMATIONS.length;
    return CLASSIC_ANSWERS.length;
  }, [mode]);

  const modeMeta = MODES.find((m) => m.id === mode)!;
  const showQuestion = mode === "classic";

  return (
    <div
      className={cn(
        "relative min-h-dvh overflow-x-hidden bg-bg text-fg",
        shaking && "animate-shake",
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-1/4 top-[-20%] h-[55vh] w-[70vw] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute -right-1/4 bottom-[-10%] h-[45vh] w-[60vw] rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.35]" />
        <div className="absolute inset-0 bg-vignette" />
      </div>

      {flash && (
        <div className="pointer-events-none absolute inset-0 z-30 bg-fg/10 animate-flash" aria-hidden />
      )}

      <div
        ref={stageRef}
        className="relative z-10 mx-auto flex min-h-dvh max-w-3xl flex-col px-4 pb-10 pt-5 sm:px-6 sm:pt-8"
      >
        <Particles burstKey={burstKey} origin={origin} />

        <header className="stagger-item relative z-40 flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-[0.7rem] tracking-[0.35em] text-muted uppercase">
              8ball.grok.me
            </p>
            <h1 className="mt-1 font-display text-4xl leading-none tracking-tight sm:text-5xl">
              8<span className="text-primary">BALL</span>
            </h1>
            <p className="mt-2 max-w-[18rem] text-sm leading-relaxed text-muted sm:max-w-sm">
              Shake the ball. Get an answer. Blame the triangle  -  not yourself.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSoundOn((s) => !s);
                tick();
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/80 text-fg backdrop-blur transition-colors hover:border-primary/50 hover:text-primary"
              aria-label={soundOn ? "Mute sound" : "Enable sound"}
            >
              {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowHistory((v) => !v);
                tick();
              }}
              className={cn(
                "flex h-11 items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 text-sm font-medium backdrop-blur transition-colors hover:border-primary/50",
                showHistory && "border-primary/50 text-primary",
              )}
              aria-expanded={showHistory}
            >
              <History className="h-4 w-4" />
              <span className="tabular-nums">{hydrated ? count : " - "}</span>
            </button>
          </div>
        </header>

        <nav
          className="stagger-item stagger-2 relative z-40 mt-7 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Modes"
        >
          {MODES.map((m) => {
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setMode(m.id);
                  tick();
                }}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-200",
                  active
                    ? "border-primary bg-primary text-primary-fg shadow-[0_0_24px_-6px_var(--color-primary)]"
                    : "border-border bg-surface/60 text-muted hover:border-fg/25 hover:text-fg",
                )}
              >
                {m.label}
              </button>
            );
          })}
        </nav>
        <p className="stagger-item stagger-3 relative z-40 mt-2.5 text-xs text-muted">{modeMeta.blurb}</p>

        {showQuestion && (
          <div className="stagger-item stagger-3 relative z-40 mt-4">
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted uppercase">
              <HelpCircle className="h-3.5 w-3.5" />
              Your question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") fire();
              }}
              placeholder="Should I text them back?"
              maxLength={120}
              className="w-full rounded-2xl border border-border bg-surface/80 px-4 py-3.5 text-base text-fg outline-none transition placeholder:text-muted/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/30"
            />
          </div>
        )}

        <div className="stagger-item stagger-4 relative z-40 mt-8 flex flex-1 flex-col items-center justify-center py-4 sm:mt-10">
          <div
            className={cn("relative", ballShaking && "animate-ball-shake")}
            style={{
              transform: charging ? `scale(${1 - charge * 0.03})` : undefined,
              transition: charging ? "none" : "transform 150ms ease-out",
            }}
          >
            <div
              className="pointer-events-none absolute inset-[-12%] rounded-full"
              style={{
                boxShadow: charging
                  ? `0 0 ${30 + charge * 70}px ${charge * 20}px color-mix(in srgb, var(--color-primary) ${15 + charge * 35}%, transparent)`
                  : undefined,
              }}
              aria-hidden
            />

            <button
              type="button"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerCancel}
              onPointerLeave={(e) => {
                if (charging) onPointerUp(e as unknown as React.PointerEvent);
              }}
              className={cn(
                "group relative flex h-[min(58vw,260px)] w-[min(58vw,260px)] select-none flex-col items-center justify-center rounded-full",
                "ball-shell transition-transform duration-150 ease-out",
                "active:translate-y-1",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/40",
                charging && "translate-y-0.5",
              )}
              aria-label="Shake the eight ball"
            >
              <span
                className="pointer-events-none absolute left-[18%] top-[12%] h-[28%] w-[38%] rounded-full bg-fg/10 blur-md"
                aria-hidden
              />

              <span className="ball-window relative flex h-[48%] w-[48%] items-center justify-center overflow-hidden rounded-full">
                {result && revealing ? (
                  <span
                    key={result.id}
                    className="answer-triangle animate-triangle-in absolute flex h-[72%] w-[78%] items-center justify-center px-2 pt-3 text-center"
                  >
                    <span className="font-display text-[clamp(0.55rem,2.4vw,0.72rem)] leading-tight tracking-wide text-primary-fg uppercase">
                      {result.headline.length > 28
                        ? result.headline.slice(0, 26) + "..."
                        : result.headline}
                    </span>
                  </span>
                ) : (
                  <span className="eight-badge flex h-[42%] w-[42%] items-center justify-center rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]">
                    <span className="font-display text-[clamp(1.6rem,7vw,2.4rem)] leading-none">
                      8
                    </span>
                  </span>
                )}
              </span>

              <span className="pointer-events-none absolute bottom-[14%] text-[0.6rem] font-medium tracking-[0.22em] text-muted uppercase">
                {charging ? "shaking..." : "press to shake"}
              </span>
            </button>
          </div>
          <p className="mt-6 text-center text-xs text-muted">
            <Dices className="mr-1 inline h-3 w-3 text-accent" />
            {poolSize} answers · ask anything · zero judgment
          </p>
        </div>

        <div className="relative z-40 min-h-[9.5rem]">
          {result ? (
            <article
              key={result.id}
              className={cn(
                "animate-result rounded-3xl border border-border bg-surface/90 p-5 backdrop-blur-md ring-2 sm:p-6",
                TONE_RING[result.tone],
                TONE_GLOW[result.tone],
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-1.5 text-[0.65rem] font-semibold tracking-[0.22em] text-muted uppercase">
                    <Sparkles className="h-3 w-3 text-accent" />
                    {MODES.find((m) => m.id === result.mode)?.label}
                  </p>
                  <h2
                    className={cn(
                      "mt-2 font-display text-2xl leading-[1.05] tracking-tight sm:text-3xl",
                      result.tone === "yes" && "text-primary",
                      result.tone === "maybe" && "text-accent",
                      result.tone === "no" && "text-muted",
                    )}
                  >
                    {result.headline}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={copyResult}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-bg/50 text-muted transition-colors hover:border-primary/40 hover:text-fg"
                  aria-label="Copy result"
                >
                  {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-3 text-base leading-relaxed text-fg/90 sm:text-lg">{result.body}</p>
            </article>
          ) : (
            <div className="flex h-full min-h-[9.5rem] items-center justify-center rounded-3xl border border-dashed border-border/80 bg-surface/30 px-6 text-center text-sm text-muted">
              Ask a question, then shake the ball. Your fate appears here.
            </div>
          )}
        </div>

        {showHistory && (
          <aside className="animate-result relative z-40 mt-5 rounded-3xl border border-border bg-surface/90 p-4 backdrop-blur-md sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-lg tracking-tight">History</h3>
              <button
                type="button"
                onClick={clearHistory}
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-primary/40 hover:text-fg"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>
            {history.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted">No shakes yet. The void awaits.</p>
            ) : (
              <ul className="max-h-56 space-y-2 overflow-y-auto pr-1">
                {history.map((h) => (
                  <li
                    key={h.id}
                    className="cursor-pointer rounded-2xl border border-border/70 bg-bg/40 px-3.5 py-3 transition-colors hover:border-primary/30"
                    onClick={() => {
                      setResult(h);
                      setRevealing(true);
                      tick();
                    }}
                  >
                    <p className="text-[0.65rem] font-semibold tracking-wider text-muted uppercase">
                      {MODES.find((m) => m.id === h.mode)?.label}
                    </p>
                    <p className="mt-0.5 font-display text-base leading-snug">{h.headline}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted">{h.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        )}

        <footer className="relative z-40 mt-8 flex flex-col items-center gap-1 text-center text-[0.7rem] tracking-wide text-muted/80">
          <p>All answers are final until you shake again</p>
          <p className="font-display text-xs tracking-[0.3em] text-muted/50 uppercase">
            8ball.grok.me
          </p>
        </footer>
      </div>
    </div>
  );
}
