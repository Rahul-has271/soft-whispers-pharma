import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "A Letter for Bhavna 🌸" },
      { name: "description", content: "A heartfelt apology — soft, sincere, and from the heart." },
    ],
  }),
});

/* ---------- Background layers ---------- */
function Petals() {
  const petals = Array.from({ length: 22 });
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {petals.map((_, i) => {
        const left = Math.random() * 100;
        const dur = 14 + Math.random() * 16;
        const delay = -Math.random() * 20;
        const size = 14 + Math.random() * 22;
        const hue = ["#fbcfe8", "#fda4af", "#f9a8d4", "#fecaca", "#e9d5ff"][i % 5];
        return (
          <svg key={i} className="petal absolute" style={{ left: `${left}%`, top: 0, width: size, height: size, animationDuration: `${dur}s`, animationDelay: `${delay}s` }} viewBox="0 0 32 32">
            <path d="M16 2 C22 8, 28 14, 16 30 C4 14, 10 8, 16 2 Z" fill={hue} opacity="0.85" />
          </svg>
        );
      })}
    </div>
  );
}

function Sparkles() {
  const dots = Array.from({ length: 40 });
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {dots.map((_, i) => (
        <span
          key={i}
          className="sparkle absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 3 + Math.random() * 4,
            height: 3 + Math.random() * 4,
            background: "white",
            boxShadow: "0 0 10px white, 0 0 20px #fbcfe8",
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
}

function MoleculePattern() {
  return (
    <svg className="pointer-events-none fixed inset-0 w-full h-full opacity-[0.07] z-0" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="mol" x="0" y="0" width="180" height="180" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="4" fill="#9d174d" />
          <circle cx="90" cy="60" r="4" fill="#9d174d" />
          <circle cx="160" cy="30" r="4" fill="#9d174d" />
          <circle cx="60" cy="140" r="4" fill="#9d174d" />
          <circle cx="140" cy="120" r="4" fill="#9d174d" />
          <line x1="20" y1="20" x2="90" y2="60" stroke="#9d174d" strokeWidth="1" />
          <line x1="90" y1="60" x2="160" y2="30" stroke="#9d174d" strokeWidth="1" />
          <line x1="90" y1="60" x2="60" y2="140" stroke="#9d174d" strokeWidth="1" />
          <line x1="60" y1="140" x2="140" y2="120" stroke="#9d174d" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mol)" />
    </svg>
  );
}

function BlurOrbs({ scrollY }: { scrollY: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="drift absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full opacity-60"
        style={{ background: "radial-gradient(circle, #fbcfe8, transparent 70%)", transform: `translateY(${scrollY * 0.15}px)` }} />
      <div className="drift absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full opacity-50"
        style={{ background: "radial-gradient(circle, #ddd6fe, transparent 70%)", transform: `translateY(${scrollY * -0.1}px)`, animationDelay: "2s" }} />
      <div className="drift absolute bottom-0 left-1/4 w-[480px] h-[480px] rounded-full opacity-50"
        style={{ background: "radial-gradient(circle, #fed7aa, transparent 70%)", transform: `translateY(${scrollY * 0.08}px)`, animationDelay: "4s" }} />
    </div>
  );
}

/* ---------- Music (Web Audio synthesized soft pad) ---------- */
function useAmbientMusic() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const timersRef = useRef<number[]>([]);

  const start = () => {
    if (ctxRef.current) return;
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    ctxRef.current = ctx;
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    masterRef.current = master;

    // Cute music-box twinkle melody in C major (Twinkle-style sweet arpeggio)
    // Notes: C5 D5 E5 G5 A5 C6 — sparkly bell tones
    const N = { C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880, B5: 987.77, C6: 1046.5, E6: 1318.5, G6: 1568 };
    const melody: Array<[number, number]> = [
      [N.C5, 0.4], [N.E5, 0.4], [N.G5, 0.4], [N.C6, 0.6],
      [N.A5, 0.4], [N.G5, 0.4], [N.E5, 0.6],
      [N.D5, 0.4], [N.F5, 0.4], [N.A5, 0.4], [N.C6, 0.6],
      [N.G5, 0.4], [N.E5, 0.4], [N.C5, 0.8],
      [N.E5, 0.4], [N.G5, 0.4], [N.C6, 0.4], [N.E6, 0.6],
      [N.D5, 0.4], [N.G5, 0.4], [N.B5, 0.6],
      [N.C5, 0.4], [N.E5, 0.4], [N.G5, 0.4], [N.C6, 1.0],
    ];

    const playNote = (freq: number, when: number, dur: number) => {
      const c = ctxRef.current; const m = masterRef.current;
      if (!c || !m) return;
      // bell: sine fundamental + soft sine harmonic
      const o1 = c.createOscillator(); o1.type = "sine"; o1.frequency.value = freq;
      const o2 = c.createOscillator(); o2.type = "sine"; o2.frequency.value = freq * 2;
      const g = c.createGain();
      g.gain.setValueAtTime(0, when);
      g.gain.linearRampToValueAtTime(0.22, when + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, when + dur);
      const g2 = c.createGain(); g2.gain.value = 0.08;
      o1.connect(g).connect(m);
      o2.connect(g2).connect(g);
      o1.start(when); o2.start(when);
      o1.stop(when + dur + 0.05); o2.stop(when + dur + 0.05);
    };

    const loop = () => {
      const c = ctxRef.current; if (!c) return;
      let t = c.currentTime + 0.1;
      let total = 0;
      melody.forEach(([f, d]) => { playNote(f, t + total, d * 1.4); total += d; });
      const id = window.setTimeout(loop, total * 1000);
      timersRef.current.push(id);
    };
    loop();

    // soft fade in
    master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2);
  };

  const stop = () => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    setTimeout(() => {
      try { ctx.close(); } catch {}
      ctxRef.current = null;
      masterRef.current = null;
    }, 1100);
  };

  const toggle = () => {
    if (on) { stop(); setOn(false); }
    else { start(); setOn(true); }
  };

  useEffect(() => () => { if (ctxRef.current) ctxRef.current.close(); }, []);
  return { on, toggle };
}

/* ---------- Loading screen ---------- */
function Loader({ done }: { done: boolean }) {
  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-dream transition-opacity duration-1000 ${done ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
      <div className="text-center">
        <svg className="bloom mx-auto" width="120" height="120" viewBox="0 0 120 120">
          {[0, 60, 120, 180, 240, 300].map((r) => (
            <ellipse key={r} cx="60" cy="35" rx="14" ry="22" fill="#f9a8d4" opacity="0.85" transform={`rotate(${r} 60 60)`} />
          ))}
          <circle cx="60" cy="60" r="10" fill="#fde68a" />
        </svg>
        <p className="mt-6 font-script text-3xl text-pink-700">blooming…</p>
      </div>
    </div>
  );
}

/* ---------- Petal burst ---------- */
function PetalBurst({ origin }: { origin: { x: number; y: number } | null }) {
  if (!origin) return null;
  const petals = Array.from({ length: 28 });
  return (
    <div className="fixed inset-0 z-[80] pointer-events-none">
      {petals.map((_, i) => {
        const angle = (i / petals.length) * Math.PI * 2;
        const dist = 200 + Math.random() * 200;
        const style: CSSProperties = {
          left: origin.x, top: origin.y,
          ["--tx" as any]: `${Math.cos(angle) * dist}px`,
          ["--ty" as any]: `${Math.sin(angle) * dist}px`,
        };
        return (
          <svg key={i} className="burst-petal absolute" style={style} width="22" height="22" viewBox="0 0 32 32">
            <path d="M16 2 C22 8, 28 14, 16 30 C4 14, 10 8, 16 2 Z" fill={["#f9a8d4","#fda4af","#fecaca","#e9d5ff","#fed7aa"][i%5]} />
          </svg>
        );
      })}
    </div>
  );
}

/* ---------- Reveal on scroll ---------- */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShow(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(40px)", transition: `all 1s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------- Page ---------- */
function Index() {
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [burst, setBurst] = useState<{ x: number; y: number } | null>(null);
  const [popup, setPopup] = useState(false);
  const music = useAmbientMusic();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1800);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, []);

  const handleSmile = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setBurst({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    setPopup(true);
    setTimeout(() => setBurst(null), 1700);
    setTimeout(() => setPopup(false), 4500);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-dream">
      <Loader done={loaded} />
      <BlurOrbs scrollY={scrollY} />
      <MoleculePattern />
      <Sparkles />
      <Petals />

      {/* Music toggle */}
      <button
        onClick={music.toggle}
        aria-label="Toggle music"
        className="fixed top-5 right-5 z-50 glass-card rounded-full w-12 h-12 flex items-center justify-center text-pink-700 hover:scale-110 transition-transform"
      >
        {music.on ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.2l2.45 2.45a4.4 4.4 0 0 0 .05-.65zM19 12a7 7 0 0 1-.6 2.82l1.5 1.5A8.95 8.95 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.51-1.42.93-2.25 1.17v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"/></svg>
        )}
      </button>

      <main className="relative z-10 px-4 sm:px-6 py-16 sm:py-24 max-w-3xl mx-auto">
        {/* Hero */}
        <section className="text-center pt-8 pb-20">
          <Reveal>
            <p className="font-serif-elegant italic text-pink-600/80 tracking-widest uppercase text-xs mb-4">a letter from the heart</p>
            <h1 className="font-script text-6xl sm:text-8xl text-transparent bg-clip-text leading-tight"
                style={{ backgroundImage: "linear-gradient(135deg, #be185d, #c026d3, #f97316)" }}>
              Hey Bhavna 🌸
            </h1>
          </Reveal>
          <Reveal delay={400}>
            <p className="mt-6 font-serif-elegant text-xl sm:text-2xl text-pink-900/70 italic">
              <span className="typewriter inline-block">I just wanted to say something honestly from my heart…</span>
            </p>
          </Reveal>
        </section>

        {/* Letter */}
        <Reveal>
          <article className="glass-card rounded-3xl p-8 sm:p-12 relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl">💌</div>
            <div className="space-y-5 font-serif-elegant text-[1.08rem] sm:text-lg leading-relaxed text-pink-950/85">
              <p>If anything I said ever came across the wrong way, or if I acted inappropriate at any point, <em>I'm truly sorry</em>. I never meant to hurt you or make you feel disrespected. That was never my intention, not even for a second.</p>
              <p>Sometimes people make mistakes without meaning to, and sometimes words fail to express the kindness a heart actually carries. But one thing I never wanted was to become a reason for your discomfort.</p>
              <p>You genuinely seem like a beautiful soul — <span className="font-script text-2xl text-pink-700">intelligent, caring,</span> and someone whose presence naturally feels comforting.</p>
              <p>And honestly, getting to know you, even a little, has been something I quietly appreciated more than you probably realize.</p>
              <p>No pressure, no expectations — I just wanted my apology to feel sincere, because some people are too special to be misunderstood.</p>
            </div>
          </article>
        </Reveal>

        {/* Quote */}
        <Reveal delay={200}>
          <div className="text-center my-24">
            <div className="text-5xl mb-4">🌷</div>
            <p className="font-script text-3xl sm:text-4xl text-pink-700 leading-snug max-w-xl mx-auto">
              "Some feelings are too genuine to be explained perfectly… they just deserve to be felt."
            </p>
          </div>
        </Reveal>

        {/* Pharma section */}
        <Reveal>
          <section className="glass-card rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="font-script text-4xl text-pink-700 mb-6">a little pharma poetry 💊</h2>

            <svg viewBox="0 0 400 80" className="w-full h-20 mb-6">
              <defs>
                <linearGradient id="hb" x1="0" x2="1">
                  <stop offset="0%" stopColor="#f9a8d4" />
                  <stop offset="100%" stopColor="#c026d3" />
                </linearGradient>
              </defs>
              <path className="heartbeat-path" d="M0 40 L80 40 L100 40 L110 20 L125 60 L140 10 L155 70 L170 40 L260 40 L275 20 L290 60 L305 10 L320 70 L335 40 L400 40"
                fill="none" stroke="url(#hb)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div className="flex justify-center gap-4 my-6 flex-wrap">
              {[0,1,2,3,4].map(i => (
                <div key={i} className="relative w-14 h-14 drift" style={{ animationDelay: `${i*0.4}s` }}>
                  <div className="absolute inset-0 rounded-full" style={{
                    background: "linear-gradient(90deg, #fda4af 50%, #fbcfe8 50%)",
                    transform: "rotate(45deg)",
                    boxShadow: "0 4px 20px rgba(244,114,182,0.4)"
                  }} />
                  <span className="absolute -top-3 -right-2 text-xl">🌸</span>
                </div>
              ))}
            </div>

            <p className="font-serif-elegant italic text-lg text-pink-900/80 max-w-xl mx-auto mt-4">
              "Even the strongest medicines take time to heal… so I hope kindness and honesty can heal misunderstandings too." 💖
            </p>
          </section>
        </Reveal>

        {/* Closing */}
        <Reveal>
          <section className="text-center my-24">
            <p className="font-script text-3xl sm:text-4xl text-pink-700 mb-4">And lastly…</p>
            <p className="font-serif-elegant text-xl sm:text-2xl italic text-pink-900/85 max-w-2xl mx-auto leading-relaxed">
              I hope your smile always stays brighter than your stressful study days, because honestly, the world looks softer when you smile. ✨
            </p>

            <button
              onClick={handleSmile}
              className="mt-12 glow-pulse rounded-full px-10 py-5 font-script text-2xl text-white relative overflow-hidden hover:scale-105 transition-transform"
              style={{ background: "linear-gradient(135deg, #ec4899, #c026d3, #f97316)" }}
            >
              Keep Smiling 🌸
            </button>
          </section>
        </Reveal>

        <footer className="text-center pb-10 pt-12">
          <p className="font-script text-xl text-pink-600/70">Made with genuine feelings ✨</p>
        </footer>
      </main>

      <PetalBurst origin={burst} />

      {/* Popup */}
      <div className={`fixed inset-0 z-[90] flex items-center justify-center px-4 transition-opacity duration-500 ${popup ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-pink-200/30 backdrop-blur-sm" onClick={() => setPopup(false)} />
        <div className={`glass-card rounded-3xl p-10 text-center max-w-sm relative ${popup ? "bloom" : ""}`}>
          <div className="text-5xl mb-3">🌸</div>
          <p className="font-script text-3xl text-pink-700">Thank you for reading this with your heart.</p>
        </div>
      </div>
    </div>
  );
}
