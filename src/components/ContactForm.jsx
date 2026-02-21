import { useMemo, useState } from "react";
import emailjs from "@emailjs/browser";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    company: "", // honeypot
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [globalMsg, setGlobalMsg] = useState("");

  const inputBase =
    "w-full rounded-xl border-2 border-[var(--bm-border)] bg-[var(--bm-surface)] px-4 py-3 text-sm text-[var(--bm-text)] outline-none focus:border-[var(--bm-secondary)]";

  const inputError =
    "border-red-500/70 focus:border-red-500/70";

  const helpText = "mt-1 text-xs text-[var(--bm-text-muted)]";
  const errorText = "mt-1 text-xs text-red-600";

  const MAX_MESSAGE = 2000;

  const env = useMemo(
    () => ({
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    }),
    []
  );

  function setField(name, value) {
    setForm((p) => ({ ...p, [name]: value }));
  }

  function markTouched(name) {
    setTouched((p) => ({ ...p, [name]: true }));
  }

  function validate(next = form) {
    const e = {};

    const name = next.name.trim();
    const email = next.email.trim();
    const subject = next.subject.trim();
    const message = next.message.trim();

    if (!name) e.name = "Skriv ditt namn.";
    if (!email) e.email = "Skriv din email.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Email-adressen ser inte rätt ut.";

    if (!subject) e.subject = "Skriv ett ämne.";
    if (!message) e.message = "Skriv ett meddelande.";
    else if (message.length < 15) e.message = "Skriv gärna lite mer (minst ~15 tecken).";
    else if (message.length > MAX_MESSAGE) e.message = `För långt meddelande (max ${MAX_MESSAGE} tecken).`;

    return e;
  }

  function onBlur(e) {
    const { name } = e.target;
    markTouched(name);
    const e2 = validate();
    setErrors(e2);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setGlobalMsg("");

    // honeypot: om bot fyller i, låtsas lyckas
    if (form.company.trim()) {
      setStatus("success");
      setGlobalMsg("Tack! Meddelandet är skickat.");
      return;
    }

    const e2 = validate();
    setErrors(e2);
    setTouched({ name: true, email: true, subject: true, message: true });

    if (Object.keys(e2).length) {
      setStatus("error");
      setGlobalMsg("Kolla fälten ovan – något saknas eller är fel.");
      return;
    }

    if (!env.serviceId || !env.templateId || !env.publicKey) {
      setStatus("error");
      setGlobalMsg("EmailJS saknar config (.env). Kontrollera VITE_EMAILJS_*.");
      return;
    }

    setStatus("sending");

    try {
      await emailjs.send(
        env.serviceId,
        env.templateId,
        {
          from_name: form.name.trim(),
          reply_to: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        },
        { publicKey: env.publicKey }
      );

      setStatus("success");
      setGlobalMsg("Tack! Meddelandet är skickat.");

      setForm({ name: "", email: "", subject: "", message: "", company: "" });
      setTouched({});
      setErrors({});

      // efter 3 sek, gå tillbaka till idle (valfritt)
      setTimeout(() => {
        setStatus("idle");
        setGlobalMsg("");
      }, 3000);
    } catch {
      setStatus("error");
      setGlobalMsg("Något gick fel vid skickning. Prova igen eller maila direkt.");
    }
  }

  const messageLen = form.message.length;

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2" noValidate>
      {/* Honeypot */}
      <div className="hidden">
        <input
          name="company"
          value={form.company}
          onChange={(e) => setField("company", e.target.value)}
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[var(--bm-text)]">
          Namn <span className="text-[var(--bm-text-muted)]">*</span>
        </label>
        <input
          className={`${inputBase} ${
            touched.name && errors.name ? inputError : ""
          }`}
          name="name"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          onBlur={onBlur}
          autoComplete="name"
          required
          placeholder="Ditt namn"
        />
        {touched.name && errors.name ? (
          <div className={errorText}>{errors.name}</div>
        ) : (
          <div className={helpText}>Skriv gärna för- och efternamn.</div>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[var(--bm-text)]">
          Email <span className="text-[var(--bm-text-muted)]">*</span>
        </label>
        <input
          className={`${inputBase} ${
            touched.email && errors.email ? inputError : ""
          }`}
          name="email"
          value={form.email}
          onChange={(e) => setField("email", e.target.value)}
          onBlur={onBlur}
          autoComplete="email"
          inputMode="email"
          required
          placeholder="din@email.se"
        />
        {touched.email && errors.email ? (
          <div className={errorText}>{errors.email}</div>
        ) : (
          <div className={helpText}>Jag använder din email för att svara.</div>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-semibold text-[var(--bm-text)]">
          Ämne <span className="text-[var(--bm-text-muted)]">*</span>
        </label>
        <input
          className={`${inputBase} ${
            touched.subject && errors.subject ? inputError : ""
          }`}
          name="subject"
          value={form.subject}
          onChange={(e) => setField("subject", e.target.value)}
          onBlur={onBlur}
          autoComplete="off"
          required
          placeholder="T.ex. Datamigrering, webb-MVP, kursmaterial…"
        />
        {touched.subject && errors.subject ? (
          <div className={errorText}>{errors.subject}</div>
        ) : (
          <div className={helpText}>En kort rad räcker.</div>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-semibold text-[var(--bm-text)]">
          Meddelande <span className="text-[var(--bm-text-muted)]">*</span>
        </label>
        <textarea
          className={`${inputBase} min-h-[140px] resize-y ${
            touched.message && errors.message ? inputError : ""
          }`}
          name="message"
          value={form.message}
          onChange={(e) => setField("message", e.target.value)}
          onBlur={onBlur}
          required
          maxLength={MAX_MESSAGE + 50} // liten buffert för bättre känsla, validering sköter hårda gränsen
          placeholder="Beskriv kort vad du vill få gjort, tidsram och vilket underlag du har idag."
        />
        <div className="mt-1 flex items-center justify-between">
          <div className={touched.message && errors.message ? errorText : helpText}>
            {touched.message && errors.message
              ? errors.message
              : "Ju mer konkret du är, desto snabbare kan jag svara."}
          </div>
          <div className="text-xs text-[var(--bm-text-muted)]">
            {messageLen}/{MAX_MESSAGE}
          </div>
        </div>
      </div>

      <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 pt-2">
        <p className="text-xs text-[var(--bm-text-muted)]">
          Jag återkommer normalt inom 1–2 arbetsdagar.
        </p>

        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-xl bg-[var(--bm-accent)] px-5 py-3 text-sm font-semibold text-black shadow-[var(--bm-shadow)] hover:bg-[var(--bm-accent-soft)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "sending"
            ? "Skickar…"
            : status === "success"
            ? "Skickat ✓"
            : "Skicka"}
        </button>
      </div>

      {globalMsg && (
        <div className="md:col-span-2 rounded-2xl border border-[var(--bm-border)] bg-[var(--bm-surface-2)] px-4 py-3 text-sm text-[var(--bm-text)]">
          {globalMsg}
        </div>
      )}
    </form>
  );
}