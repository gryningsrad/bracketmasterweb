import { useEffect, useMemo, useState } from "react";
import {
  Database,
  Code2,
  Ship,
  GraduationCap,
  FileSpreadsheet,
  ArrowRight,
  Braces,
  Boxes,
  MonitorSmartphone,
  ClipboardList,
  Repeat,
  FileText,
  MessagesSquare,
  PackageCheck,
  AlertTriangle,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import ContactForm from "./components/ContactForm";

const THEMES = {
  dark: {
    "--bm-bg": "#2F2F2F",
    "--bm-surface": "#3A3A3A",
    "--bm-surface-2": "#444444",
    "--bm-text": "#F5F5F5",
    "--bm-text-muted": "#CFCFCF",
    "--bm-border": "rgba(255,255,255,0.10)",
    "--bm-accent": "#F9A23C",
    "--bm-accent-soft": "#FFB85C",
    "--bm-secondary": "#6C8EA4",
    "--bm-shadow": "0 20px 45px rgba(0,0,0,0.35)",
    "--bm-bg-grad-1": "rgba(249,162,60,0.12)",
    "--bm-bg-grad-2": "rgba(108,142,164,0.10)",
  },
  light: {
    "--bm-bg": "#F6F3EE",
    "--bm-surface": "#FFFFFF",
    "--bm-surface-2": "#ECE6DC",
    "--bm-text": "#1F1F1F",
    "--bm-text-muted": "#4D4D4D",
    "--bm-border": "rgba(0,0,0,0.18)",
    "--bm-accent": "#F9A23C",
    "--bm-accent-soft": "#FFD2A0",
    "--bm-secondary": "#3F6E86",
    "--bm-shadow": "0 18px 50px rgba(0,0,0,0.18)",
    "--bm-bg-grad-1": "rgba(249,162,60,0.14)",
    "--bm-bg-grad-2": "rgba(63,110,134,0.10)",
  },
};

function applyTheme(name) {
  const vars = THEMES[name] ?? THEMES.light;
  Object.entries(vars).forEach(([k, v]) =>
    document.documentElement.style.setProperty(k, v)
  );
  document.documentElement.dataset.theme = name;
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--bm-border)] bg-[var(--bm-surface-2)] px-3 py-1 text-xs text-[var(--bm-text-muted)]">
      {children}
    </span>
  );
}

function SectionTitle({ kicker, title, desc }) {
  return (
    <div className="mb-6">
      {kicker && (
        <p className="text-sm tracking-wide text-[var(--bm-secondary)]">
          {kicker}
        </p>
      )}
      <h2 className="mt-1 text-2xl font-semibold text-[var(--bm-text)]">
        {title}
      </h2>
      {desc && <p className="mt-2 text-[var(--bm-text-muted)]">{desc}</p>}
    </div>
  );
}

function SkillCard({ title, lead, bullets, tools, icon: Icon, cta }) {
  return (
    <div className="rounded-2xl border-2 border-[var(--bm-border)] bg-[var(--bm-surface)] p-6 shadow-[var(--bm-shadow)] transition-all hover:-translate-y-1 flex flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--bm-text)]">{title}</h3>
          <p className="mt-2 text-sm text-[var(--bm-text-muted)]">{lead}</p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--bm-border)] bg-[var(--bm-surface-2)]">
          {Icon ? <Icon className="h-5 w-5 text-[var(--bm-secondary)]" /> : null}
        </div>
      </div>

      <ul className="mt-4 space-y-2 text-sm">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[var(--bm-accent)]" />
            <span className="text-[var(--bm-text-muted)]">{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-2">
        {tools.map((t) => (
          <Pill key={t}>{t}</Pill>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-6 pt-4 border-t border-[var(--bm-border)] flex items-center justify-between gap-3">
        <p className="text-xs text-[var(--bm-text-muted)]">
          {cta?.hint ?? "Berätta kort vad du behöver hjälp med."}
        </p>

        <a
          href={cta?.href ?? "#kontakt"}
          className="shrink-0 rounded-xl bg-[var(--bm-accent)] px-4 py-2 text-sm font-semibold text-black shadow-[var(--bm-shadow)] hover:bg-[var(--bm-accent-soft)]"
        >
          {cta?.label ?? "Kontakt"}
        </a>
      </div>
    </div>
  );
}


function PipelineHero() {
  const steps = [
    { title: "Excel / CSV", subtitle: "Källor", Icon: FileSpreadsheet },
    { title: "Python", subtitle: "Rensning & validering", Icon: Braces },
    { title: "Databas", subtitle: "Spårbarhet", Icon: Boxes },
    { title: "Webb", subtitle: "Gränssnitt i drift", Icon: MonitorSmartphone },
  ];

  return (
    <div className="rounded-3xl border-2 border-[var(--bm-border)] bg-[var(--bm-surface)] p-8 shadow-[var(--bm-shadow)]">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-[var(--bm-text)]">
          Från rådata till användbart verktyg
        </p>
        <div className="flex items-center gap-3 text-xs text-[var(--bm-text-muted)]">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--bm-accent)]" />
            Repeterbart
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--bm-secondary)]" />
            Spårbart
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {steps.map((s, idx) => (
          <div key={s.title} className="flex items-center">
            <div className="flex w-full items-center gap-4 rounded-2xl border border-[var(--bm-border)] bg-[var(--bm-surface-2)] px-4 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--bm-border)] bg-[var(--bm-accent)]/18">
                <s.Icon className="h-5 w-5 text-[var(--bm-text)]" />
              </div>

              <div className="min-w-0">
                <div className="text-sm font-semibold text-[var(--bm-text)]">
                  {s.title}
                </div>
                <div className="text-xs text-[var(--bm-text-muted)]">
                  {s.subtitle}
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <span className="hidden sm:inline text-xs text-[var(--bm-text-muted)]">
                  steg {idx + 1}/4
                </span>
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div className="mx-3 hidden md:flex items-center">
                <div className="h-px w-10 bg-[var(--bm-border)]" />
                <ArrowRight className="h-4 w-4 text-[var(--bm-text-muted)]" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--bm-border)] bg-[var(--bm-surface)] px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--bm-border)] bg-[var(--bm-secondary)]/20">
            <Database className="h-4 w-4 text-[var(--bm-secondary)]" />
          </div>
          <div>
            <p className="text-sm text-[var(--bm-text)]">
              Resultat: tydlig datamodell, loggar och export – så lösningen går
              att förvalta.
            </p>
            <p className="mt-1 text-xs text-[var(--bm-text-muted)]">
              Inga “magiska” engångsgrejer. Bara robust hantverk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BackgroundGlow({ children }) {
  return (
    <div className="relative min-h-screen bg-[var(--bm-bg)] overflow-hidden">
      {/* soft gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, var(--bm-bg-grad-1), transparent 60%)` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -right-48 h-[600px] w-[600px] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, var(--bm-bg-grad-2), transparent 60%)` }}
      />

      {/* slight vignette for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 50% 0%, rgba(255,255,255,0.06), transparent 55%)",
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative">{children}</div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const skills = useMemo(
    () => [
      {
        title: "Databearbetning & datamigrering (Python)",
        icon: Database,
        lead:
          "När Excel och manuellt arbete inte räcker – scripts som går att köra om och om igen.",
        bullets: [
          "Rensning, validering och kvalitetssäkring",
          "Konvertering mellan Excel/CSV/JSON/XML",
          "Migreringar med loggar och “dry-run”",
          "Rapporter som även icke-utvecklare kan använda",
        ],
        tools: ["Python", "pandas", "SQLite", "API:er", "Excel"],
        cta: {
          label: "Boka datagenomgång",
          href: "#kontakt",
          hint: "Ex: Excel → databas / städa data / migrera."
        }
      },
      {
        title: "Webbutveckling (React/NodeJS)",
        icon: Code2,
        lead:
          "Snabba, moderna och lättskötta webbgränssnitt – med ordning i koden.",
        bullets: [
          "SPA-sidor och interna verktyg",
          "Komponentstruktur som går att vidareutveckla",
          "Responsiv design (mobil → desktop)",
          "Designsystem: typografi, spacing, färger",
        ],
        tools: ["Vite", "React", "Tailwind", "Git", "NodeJS"],
        cta: {
          label: "Diskutera webblösning",
          href: "#kontakt",
          hint: "Ex: intern app, dashboard eller MVP."
        }
      },
      {
        title: "Sjöfart & systemförståelse",
        icon: Ship,
        lead:
          "Praktisk förståelse för fartygssystem, drift och underhåll – utan teori för teorins skull.",
        bullets: [
          "Systemgenomgångar och tekniska förklaringar",
          "Underhållstänk: spårbarhet, reservdelar, tillförlitlighet",
          "Alltid med regelverk och säkerhet i bakhuvudet",
          "Verklighetsnära case från driftmiljö",
        ],
        tools: ["Tekniska system", "Dokumentation", "SOLAS", "ISM", "Underhållsplanering"],
        cta: {
          label: "Ta ett tekniksnack",
          href: "#kontakt",
          hint: "Ex: systemgenomgång, felsökningslogik, dokumentation."
        }
      },
      {
        title: "Utbildning & kursmaterial",
        icon: GraduationCap,
        lead:
          "Struktur, progression och uppgifter som tränar rätt saker – på riktigt.",
        bullets: [
          "Kursupplägg, uppgifter och bedömning",
          "Maritima ämnen med tydlig röd tråd",
          "Projektledning: planering, risk, scope",
          "Material som går att använda direkt i klassrummet",
        ],
        tools: ["Pedagogik", "Case", "Projektmetodik"],
        cta: {
          label: "Planera upplägg",
          href: "#kontakt",
          hint: "Ex: uppgifter, progression, bedömning."
        }
      },
    ],
    []
  );

  const workstyle = useMemo(
    () => [
      { title: "Tydliga antaganden och avgränsning", Icon: ClipboardList },
      { title: "Repetitionsbara flöden (loggar, spårbarhet)", Icon: Repeat },
      { title: "Praktisk dokumentation – bara det som behövs", Icon: FileText },
      { title: "Korta avstämningar, inga överraskningar", Icon: MessagesSquare },
      {
        title: "Ren överlämning: filer, versioner, instruktion",
        Icon: PackageCheck,
      },
      { title: "Rak bedömning av tradeoffs och risk", Icon: AlertTriangle },
    ],
    []
  );

  return (
    <BackgroundGlow>
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-[var(--bm-border)] bg-[var(--bm-bg)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
          <div className="flex items-center gap-5">
            <img
              src="/logo.png"
              alt="BracketMaster"
              className="h-16 w-auto rounded-2xl shadow-lg"
            />

            <div>
              <h1 className="text-2xl font-semibold text-[var(--bm-text)] tracking-tight">
                BracketMaster
              </h1>
              <p className="text-sm text-[var(--bm-text-muted)]">
                Data • Webb • Lärande
              </p>
            </div>
          </div>

          <a
            href="#kontakt"
            className="rounded-xl bg-[var(--bm-accent)] px-5 py-3 text-sm font-semibold text-black shadow-[var(--bm-shadow)] hover:bg-[var(--bm-accent-soft)]"
          >
            Kontakta mig
          </a>
        </div>
      </header>

      {/* HERO */}
      <main className="mx-auto max-w-6xl px-4">
        <section className="py-14 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm text-[var(--bm-secondary)]">
                Göteborg • Sverige • Alltid med leverans
              </p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
                <span className="bg-gradient-to-r from-[var(--bm-text)] to-[var(--bm-secondary)] bg-clip-text text-transparent">
                  Data, webb och utbildning – med struktur och leverans i fokus.
                </span>
              </h1>

              <p className="mt-4 text-[var(--bm-text-muted)]">
                Jag hjälper små och medelstora verksamheter att rensa, flytta och
                strukturera data – och bygga enkla webblösningar som fungerar i
                drift.
              </p>
              <p className="mt-4 text-[var(--bm-text-muted)]">
                Samma tänk i utbildning: tydliga upplägg, progression och
                material som går att använda direkt.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#kompetenser"
                  className="rounded-xl border-2 border-[var(--bm-border)] bg-[var(--bm-surface)] px-4 py-2 text-sm font-semibold text-[var(--bm-text)] shadow-[var(--bm-shadow)] hover:border-[var(--bm-secondary)]"
                >
                  Se kompetenser
                </a>
                <a
                  href="#arbetssatt"
                  className="rounded-xl border-2 border-[var(--bm-border)] bg-transparent px-4 py-2 text-sm text-[var(--bm-text)] hover:border-[var(--bm-secondary)]"
                >
                  Arbetssätt
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Pill>Python & datamigrering</Pill>
                <Pill>React (Vite/Tailwind)</Pill>
                <Pill>NodeJS</Pill>
                <Pill>Marinteknik</Pill>
                <Pill>Projektledning</Pill>
              </div>
            </div>

            {/* Hero-illustration */}
            <PipelineHero />
          </div>
        </section>

        {/* KOMPETENSER */}
        <section
          id="kompetenser"
          className="rounded-3xl bg-[var(--bm-surface-2)]/40 px-6 py-16"
        >
          <SectionTitle
            kicker="Kompetenser"
            title="Det här hjälper jag till med"
            desc="Fokus på färdigheter och leverans – inte kundlogotyper."
          />

          <div className="grid gap-6 md:grid-cols-2">
            {skills.map((s) => (
              <SkillCard key={s.title} {...s} />
            ))}
          </div>
        </section>

        {/* ARBETSSÄTT - LYFT */}
        <section
          id="arbetssatt"
          className="mt-14 rounded-3xl bg-[var(--bm-surface-2)]/35 px-6 py-16"
        >
          <SectionTitle
            kicker="Arbetssätt"
            title="Det du kan förvänta dig"
            desc="Tydlig kommunikation, väldefinierat scope och stabil leverans som går att ta över och förvalta."
          />

          <div className="mb-6 flex flex-wrap gap-2">
            <Pill>Scope → plan</Pill>
            <Pill>Bygg → logga</Pill>
            <Pill>Leverera → dokumentera</Pill>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {workstyle.map((item, i) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border-2 border-[var(--bm-border)] bg-[var(--bm-surface)] p-5 shadow-[var(--bm-shadow)] transition-all hover:-translate-y-1"
              >
                {/* Accent-stripe */}
                <div className="absolute left-0 top-0 h-full w-1 bg-[var(--bm-accent)]/60" />

                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--bm-border)] bg-[var(--bm-surface-2)]">
                    <item.Icon className="h-5 w-5 text-[var(--bm-secondary)]" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[var(--bm-text)]">
                        {item.title}
                      </p>
                      <span className="text-xs text-[var(--bm-text-muted)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-[var(--bm-text-muted)]">
                      Fokus på robusthet, enkelhet och förvaltning.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* OM */}
        <section id="om" className="py-14">
          <SectionTitle kicker="Om" title="BracketMaster" />
          <div className="rounded-3xl border-2 border-[var(--bm-border)] bg-[var(--bm-surface)] p-8 shadow-[var(--bm-shadow)]">
            <p className="text-[var(--bm-text-muted)]">
              Startades 2023 av mig, då ett företag behövde en one-off-lösning för att sammanställa och rensa data från flera Excel-filer. 
              Under 2024 utökades erbjudandet till att även omfatta webbutveckling och när möjligheten dök upp att hjälpa till som
              lärare på Lindholmens Tekniska Gymnasieskola så tog jag chansen även där för att utbilda nästa generation motormän.
            </p>
            <p className="mt-3 text-[var(--bm-text-muted)]">
              Under 2025 har jag fortsätta med lärarrollen, då i Projekledning och Ekonomistyrning på Uddevalla Vux, i kursen
              Marin serviceingenjör.
            </p>
            <p className="mt-3 text-[var(--bm-text-muted)]">
              Jag är i vardagen 1:e fartygsingenjör på Stena Line, där jag är arbetsledare för maskinbesättningen på "Mecklenburg-Vorpommern".
              Hemma i Göteborg driver jag desssutom en vinimport <a href="https://www.wineex.se/" className="text-[var(--bm-secondary)] hover:underline" target="_blank" rel="noreferrer">WineEx</a>.
            </p>
          </div>
        </section>

        {/* KONTAKT */}
        <section id="kontakt" className="py-14 pb-24">
          <ContactForm />
        </section>
      </main>

      <footer className="border-t border-[var(--bm-border)] bg-[var(--bm-bg)]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-10 md:grid-cols-3">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="BracketMaster"
                  className="h-12 w-auto rounded-2xl shadow-lg"
                />
                <div>
                  <p className="text-base font-semibold text-[var(--bm-text)]">
                    BracketMaster AB
                  </p>
                  <p className="text-sm text-[var(--bm-text-muted)]">
                    Data • Webb • Lärande
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-[var(--bm-text-muted)]">
                &nbsp;
              </p>
            </div>

            {/* Företagsuppgifter */}
            <div>
              <dl className="mt-4 space-y-2 text-sm text-[var(--bm-text-muted)]">
                <div className="flex justify-between gap-6">
                  <dd className="text-left text-[var(--bm-text)] font-semibold" colspan="2">BracketMaster Datakonsult AB</dd>
                </div>

                <div className="flex justify-between gap-6">
                  <dt className="shrink-0">Org.nr</dt>
                  <dd className="text-right text-[var(--bm-text)]">
                    559459-4250
                  </dd>
                </div>

                <div className="flex justify-between gap-6">
                  <dt className="shrink-0">Adress</dt>
                  <dd className="text-right text-[var(--bm-text)]">
                    Göteborg, Sverige
                  </dd>
                </div>

                <div className="flex justify-between gap-6">
                  <dt className="shrink-0">Telefon</dt>
                  <dd className="text-right text-[var(--bm-text)]">
                    +46 739 25 54 83
                  </dd>
                </div>

                <div className="flex justify-between gap-6">
                  <dt className="shrink-0">Email</dt>
                  <dd className="text-right">
                    <a
                      className="text-[var(--bm-text)] hover:text-[var(--bm-secondary)]"
                      href="mailto:mikael@bracketmaster.se"
                    >
                      mikael@bracketmaster.se
                    </a>
                  </dd>
                </div>
              </dl>

              <p className="mt-4 text-xs text-[var(--bm-text-muted)]">
                (Byt ut placeholders ovan innan publicering.)
              </p>
            </div>

            {/* Snabblänkar */}
            <div>
              <p className="text-sm font-semibold text-[var(--bm-text)]">Snabblänkar</p>

              <div className="mt-4 grid gap-2 text-sm">
                <a
                  href="#kompetenser"
                  className="text-[var(--bm-text-muted)] hover:text-[var(--bm-text)]"
                >
                  Kompetenser
                </a>
                <a
                  href="#arbetssatt"
                  className="text-[var(--bm-text-muted)] hover:text-[var(--bm-text)]"
                >
                  Arbetssätt
                </a>
                <a
                  href="#om"
                  className="text-[var(--bm-text-muted)] hover:text-[var(--bm-text)]"
                >
                  Om
                </a>
                <a
                  href="#kontakt"
                  className="text-[var(--bm-text-muted)] hover:text-[var(--bm-text)]"
                >
                  Kontakt
                </a>

                <a
                  href="https://www.linkedin.com/company/bracketmaster-datakonsult-ab/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex w-fit items-center rounded-xl border border-[var(--bm-border)] bg-[var(--bm-surface)] px-4 py-2 text-sm font-semibold text-[var(--bm-text)] shadow-[var(--bm-shadow)] hover:border-[var(--bm-secondary)]"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col gap-3 border-t border-[var(--bm-border)] pt-6 text-sm text-[var(--bm-text-muted)] md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} BracketMaster AB • Sverige</p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="text-[var(--bm-text-muted)] hover:text-[var(--bm-text)]"
              >
                Integritet
              </a>
              <a
                href="#"
                className="text-[var(--bm-text-muted)] hover:text-[var(--bm-text)]"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </BackgroundGlow>
  );
}
