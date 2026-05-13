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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const items = Array.from({ length: 16 });
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {items.map((_, i) => {
        const left = Math.random() * 100;
        const dur = 16 + Math.random() * 14;
        const delay = -Math.random() * 20;
        const size = 14 + Math.random() * 10;
        return (
          <span
            key={i}
            className="petal absolute select-none"
            style={{
              left: `${left}%`,
              top: 0,
              fontSize: size,
              opacity: 0.75,
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
            }}
          >
            🌸
          </span>
        );
      })}
    </div>
  );
}

function Sparkles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
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
    <svg className="pointer-events-none fixed inset-0 w-full h-full opacity-[0.11] z-0" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* hexagonal molecule + bonds */}
        <pattern id="mol" x="0" y="0" width="220" height="220" patternUnits="userSpaceOnUse">
          <g stroke="#9d174d" strokeWidth="1.1" fill="none">
            <polygon points="60,30 95,50 95,90 60,110 25,90 25,50" />
            <line x1="95" y1="50" x2="130" y2="30" />
            <line x1="95" y1="90" x2="130" y2="110" />
            <line x1="25" y1="90" x2="-10" y2="110" />
          </g>
          <g fill="#9d174d">
            <circle cx="60" cy="30" r="3" />
            <circle cx="95" cy="50" r="3" />
            <circle cx="95" cy="90" r="3" />
            <circle cx="60" cy="110" r="3" />
            <circle cx="25" cy="90" r="3" />
            <circle cx="25" cy="50" r="3" />
            <circle cx="130" cy="30" r="3" />
            <circle cx="130" cy="110" r="3" />
          </g>
          {/* medical plus crosses */}
          <g fill="#9d174d" opacity="0.7">
            <rect x="170" y="150" width="4" height="20" rx="1" />
            <rect x="162" y="158" width="20" height="4" rx="1" />
            <rect x="20" y="180" width="3" height="14" rx="1" />
            <rect x="14.5" y="185.5" width="14" height="3" rx="1" />
          </g>
          {/* tiny capsule */}
          <g transform="translate(150,180) rotate(25)">
            <rect x="0" y="0" width="36" height="12" rx="6" fill="none" stroke="#9d174d" strokeWidth="1" />
            <line x1="18" y1="0" x2="18" y2="12" stroke="#9d174d" strokeWidth="1" />
          </g>
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

    // Slow emotional piano-like melody in A minor — heartfelt, tender
    const N = {
      A3: 220, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392,
      A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880,
    };
    // [freq, beats] — beat = 0.6s. Uses rests via freq=0.
    const melody: Array<[number, number]> = [
      [N.A4, 1.5], [N.C5, 0.5], [N.E5, 1], [N.D5, 1],
      [N.C5, 1.5], [N.B4, 0.5], [N.A4, 2],
      [N.G4, 1.5], [N.A4, 0.5], [N.C5, 1], [N.B4, 1],
      [N.A4, 2], [0, 1],
      [N.E5, 1], [N.D5, 1], [N.C5, 1], [N.B4, 1],
      [N.A4, 1.5], [N.G4, 0.5], [N.A4, 3],
      [0, 1],
    ];
    // Soft chord pad beneath — Am, F, C, G
    const chords: Array<number[]> = [
      [N.A3, N.E4, N.A4], [N.F4, N.A4, N.C5],
      [N.C4, N.E4, N.G4], [N.G4, N.B4, N.D5],
    ];
    const beat = 0.6;

    const playNote = (freq: number, when: number, dur: number) => {
      const c = ctxRef.current; const m = masterRef.current;
      if (!c || !m || freq <= 0) return;
      // soft piano: triangle + sine harmonic, slow attack, long release
      const o1 = c.createOscillator(); o1.type = "triangle"; o1.frequency.value = freq;
      const o2 = c.createOscillator(); o2.type = "sine"; o2.frequency.value = freq * 2;
      const g = c.createGain();
      g.gain.setValueAtTime(0, when);
      g.gain.linearRampToValueAtTime(0.28, when + 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, when + dur);
      const g2 = c.createGain(); g2.gain.value = 0.05;
      o1.connect(g).connect(m);
      o2.connect(g2).connect(g);
      o1.start(when); o2.start(when);
      o1.stop(when + dur + 0.1); o2.stop(when + dur + 0.1);
    };

    const playPad = (freqs: number[], when: number, dur: number) => {
      const c = ctxRef.current; const m = masterRef.current;
      if (!c || !m) return;
      const g = c.createGain();
      g.gain.setValueAtTime(0, when);
      g.gain.linearRampToValueAtTime(0.05, when + 0.6);
      g.gain.linearRampToValueAtTime(0.04, when + dur - 0.6);
      g.gain.linearRampToValueAtTime(0, when + dur);
      g.connect(m);
      freqs.forEach((f) => {
        const o = c.createOscillator(); o.type = "sine"; o.frequency.value = f;
        o.connect(g); o.start(when); o.stop(when + dur + 0.05);
      });
    };

    const loop = () => {
      const c = ctxRef.current; if (!c) return;
      const t = c.currentTime + 0.1;
      let total = 0;
      melody.forEach(([f, d]) => { playNote(f, t + total, d * beat * 1.1); total += d * beat; });
      // chord pad cycle across the loop
      const chordDur = total / chords.length;
      chords.forEach((ch, i) => playPad(ch, t + i * chordDur, chordDur));
      const id = window.setTimeout(loop, total * 1000);
      timersRef.current.push(id);
    };
    loop();

    // gentle fade in
    master.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 3);
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
      <Petals />

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

        <footer className="relative pb-10 pt-12 text-center">
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
