import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { LADDER, estimateSplit, milestoneErrorFor, rankErrorFor } from "@/lib/pricing";
import { CONTACT, copyText } from "@/lib/contact";
import { scrollToTop, useReveal } from "@/lib/useReveal";
import { useScrollSpy } from "@/lib/useScrollSpy";

export const Route = createFileRoute("/")({
  component: Index,
});

const rankPrices = [
  { pip: "iron", price: "PHP 60", route: "Iron 1 to Bronze 4" },
  { pip: "bronze", price: "PHP 75", route: "Bronze 1 to Silver 4" },
  { pip: "silver", price: "PHP 105", route: "Silver 1 to Gold 4" },
  { pip: "gold", price: "PHP 175", route: "Gold 1 to Platinum 4" },
  { pip: "platinum", price: "PHP 220", route: "Platinum 1 to Emerald 4" },
  { pip: "emerald", price: "PHP 270", route: "Emerald 1 to Diamond 4" },
  { pip: "diamond", price: "PHP 300", route: "Diamond 1 to Master" },
];

const climbRates = [
  { pip: "iron", price: "PHP 40 / rank", route: "Iron" },
  { pip: "bronze", price: "PHP 65 / rank", route: "Bronze" },
  { pip: "silver", price: "PHP 80 / rank", route: "Silver" },
  { pip: "gold", price: "PHP 95 / rank", route: "Gold" },
  { pip: "platinum", price: "PHP 140 / rank", route: "Platinum" },
  { pip: "emerald", price: "PHP 235 / rank", route: "Emerald" },
  { pip: "diamond", price: "PHP 250 / rank", route: "Diamond" },
  { pip: "master", price: "PHP 350 / 100 LP", route: "Master" },
];

const services = [
  {
    badge: "Most popular",
    blurb:
      "A booster plays your SEA account to the target division. Best for fast promotion pushes.",
    from: "From PHP 40",
    title: "Solo Boost",
  },
  {
    badge: "Plus 40 percent",
    blurb:
      "Queue together with your booster and keep full account control. Listed price plus 40 percent.",
    from: "From PHP 56",
    title: "Duo Boost",
  },
  {
    badge: "Fixed ladder",
    blurb:
      "One fixed price per promotion leg, Iron through Master. No per-game counting.",
    from: "From PHP 60",
    title: "Promotion Package",
  },
  {
    badge: null,
    blurb:
      "Fresh season or returning account? Send last rank and games left for a fixed placement quote.",
    from: "Ask for quote",
    title: "Placement Matches",
  },
  {
    badge: "Best value",
    blurb:
      "Priced from your current rank when the gap is more than one promotion. Transparent per-rank math.",
    from: "From PHP 40 / rank",
    title: "Per-Rank Climb",
  },
  {
    badge: null,
    blurb:
      "VOD review or live session with a high-rank SEA player. Roles, pathing, and lane setups.",
    from: "Ask for slots",
    title: "Coaching",
  },
];

const steps = [
  {
    body: "Pick Solo, Duo, Placements, or Coaching. Send current rank, target, queue, roles, and availability.",
    index: "01",
    title: "Select Service",
  },
  {
    body: "We confirm the total and timing in chat first. Pay by GCash or Maya. No card form lives on this site.",
    index: "02",
    title: "Complete Payment",
  },
  {
    body: "Your booster starts and sends progress updates until the final result screenshot.",
    index: "03",
    title: "Rank Up",
  },
];

/* Real client reviews only — paste verified orders here, never invent
 * entries. Quote and name are optional; detail + image alone still render.
 *   { quote: "…", name: "…", detail: "Gold 4 → Platinum 4 · Solo",
 *     image: "/reviews/juan-g4-p4.jpg" }
 * Screenshots live in public/reviews/ and are referenced by URL path. */
const testimonials: {
  quote?: string;
  name?: string;
  detail: string;
  image?: string;
}[] = [
  {
    detail: "Emerald → Master",
    image: "/reviews/eme-to-master.jpg",
  },
  {
    detail: "Master → Grandmaster · 200 LP",
    image: "/reviews/master-to-gm-200lp.jpg",
  },
  {
    detail: "Platinum 4 → Emerald · Duo",
    image: "/reviews/plat-4-to-eme-duo.jpg",
  },
  {
    detail: "Diamond 4 → Master",
    image: "/reviews/dia-4-to-master.jpg",
  },
  {
    detail: "Gold 2 → Platinum 4",
    image: "/reviews/gold-2-to-plat-4.jpg",
  },
  {
    detail: "Gold 4 → Platinum 4",
    image: "/reviews/gold-4-to-plat-4.jpg",
  },
];

const faqs = [  {
    answer:
      "Yes. We play every order on the SEA server for League of Legends. We turn down other regions and other games.",
    question: "Is this SEA only?",
  },
  {
    answer:
      "GCash or Maya. We confirm your total in chat before play starts. Duo adds 40 percent to the listed price.",
    question: "How does payment work?",
  },
  {
    answer:
      "Solo Boost needs your login details for the session; Duo Boost does not because you play on your own account. Never share codes or payment PINs.",
    question: "Do I share my account?",
  },
  {
    answer:
      "Gap, queue, and booster availability set the pace. Send your current and target rank and we'll estimate timing with your quote.",
    question: "How long does a climb take?",
  },
  {
    answer:
      "Fill the form below, copy your details, then continue on Facebook, Discord, or TikTok. We reply with your next step and final quote.",
    question: "How do I start?",
  },
];

function ScrollProgress() {
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const bar = barRef.current;
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden="true" className="scroll-progress">
      <span ref={barRef} />
    </div>
  );
}

function CopyButton({
  text,
  label,
  className,
  disabled,
}: {
  text: string;
  label: string;
  className?: string;
  disabled?: boolean;
}) {
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      className={className ?? "copy-btn"}
      disabled={disabled}
      onClick={async () => {
        await copyText(text);
        setDone(true);
        window.setTimeout(() => setDone(false), 2000);
      }}
    >
      {done ? "Copied ✓" : label}
    </button>
  );
}

function ResultImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <span className={`result-img${loaded ? " is-loaded" : ""}`}>
      {!loaded && <span className="result-img__skeleton" aria-hidden="true" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        ref={(el) => {
          // Cached / SSR-hydrated images are already complete — onLoad won't
          // re-fire, so mark loaded here or the photo stays invisible.
          if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </span>
  );
}

function Index() {
  useReveal();
  const activeSection = useScrollSpy(["services", "process", "prices", "reviews", "results", "contact"]);
  const year = new Date().getFullYear();
  const [currentRank, setCurrentRank] = useState("Silver 1");
  const [targetRank, setTargetRank] = useState("Gold 4");
  const [milestone, setMilestone] = useState("Gold 4");
  const [duo, setDuo] = useState(false);
  const [payMethod, setPayMethod] = useState("GCash");
  const [payPlan, setPayPlan] = useState("Full");
  const [channel, setChannel] = useState("Facebook");
  const [discordAccount, setDiscordAccount] = useState(
    CONTACT.discordHandles[0],
  );
  const [selectedService, setSelectedService] = useState("Solo Boost");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const rankError = rankErrorFor(currentRank, targetRank);
  const splitError = rankError ?? milestoneErrorFor(currentRank, milestone, targetRank);
  const blocked = Boolean(splitError) || !formValid;
  const split = splitError
    ? null
    : estimateSplit(currentRank, milestone, targetRank, duo);

  const copyDetails = async () => {
    if (blocked || !split) return;
    const data = formRef.current ? new FormData(formRef.current) : null;
    const field = (name: string) => String(data?.get(name) ?? "").trim();
    const php = (n: number) => `PHP ${n.toLocaleString("en-PH")}`;
    const lines = [
      "SEA Climbforge inquiry",
      `Service: ${selectedService}${duo ? " (Duo)" : ""}`,
      `Current rank: ${currentRank}`,
      `Target rank: ${targetRank}`,
      split.leg2
        ? `Payment: ${payMethod} · Partial: ${php(split.leg1.total)} now (${currentRank} → ${milestone}), ${php(split.leg2.total)} later (${milestone} → ${targetRank})`
        : `Payment: ${payMethod} · Full: ${php(split.total)}`,
    ];
    const name = field("name");
    const contact = field("contact");
    const message = field("message");
    if (name) lines.push(`Name: ${name}`);
    if (contact) lines.push(`Contact: ${contact}`);
    const channelDetail =
      channel === "Discord"
        ? `Discord (${discordAccount})`
        : channel === "TikTok"
          ? `TikTok (${CONTACT.tiktokHandle})`
          : "Facebook";
    lines.push(`Reachable via: ${channelDetail}`);
    if (message) lines.push(`Notes: ${message}`);
    const text = lines.join("\n");
    await copyText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="rankforge-site">
      <ScrollProgress />
      <a className="skip-link" href="#services">
        Skip to services
      </a>

      <header className="site-nav">
        <a
          className="brand-mark"
          href="#top"
          aria-label="SEA Climbforge home — back to top"
          onClick={scrollToTop}
        >
          <span className="brand-mark__crest" aria-hidden="true">
            SR
          </span>
          <span>SEA Climbforge</span>
        </a>
        <nav aria-label="Primary navigation">
          <a
            href="#services"
            className={activeSection === "services" ? "is-active" : undefined}
            aria-current={activeSection === "services" ? "location" : undefined}
          >
            Services
          </a>
          <a
            href="#process"
            className={activeSection === "process" ? "is-active" : undefined}
            aria-current={activeSection === "process" ? "location" : undefined}
          >
            Process
          </a>
          <a
            href="#prices"
            className={activeSection === "prices" ? "is-active" : undefined}
            aria-current={activeSection === "prices" ? "location" : undefined}
          >
            Prices
          </a>
          <a
            href="#reviews"
            className={activeSection === "reviews" ? "is-active" : undefined}
            aria-current={activeSection === "reviews" ? "location" : undefined}
          >
            Trust
          </a>
          <a
            href="#results"
            className={activeSection === "results" ? "is-active" : undefined}
            aria-current={activeSection === "results" ? "location" : undefined}
          >
            Results
          </a>
          <a
            href="#contact"
            className={activeSection === "contact" ? "is-active" : undefined}
            aria-current={activeSection === "contact" ? "location" : undefined}
          >
            Contact
          </a>
        </nav>
        <span className="nav-actions">
          <a className="nav-cta nav-cta--solid" href="#contact">
            Boost Me
          </a>
          <a
            className="nav-cta"
            href={CONTACT.facebookUrl}
            target="_blank"
            rel="noreferrer"
          >
            Message Us
          </a>
        </span>
      </header>

      <section id="top" className="hero" aria-label="Featured climb">
        <div className="hero__inner">
          <p className="section-kicker">LEAGUE OF LEGENDS / SEA SERVER</p>
          <h1>
            Get to your <span className="hero-accent">desired division</span> today.
          </h1>
          <p>
            League of Legends boosting, SEA server only. Fixed PHP prices,
            GCash or Maya, manual confirmation on every order.
          </p>
          <ul className="hero__tags">
            <li>Fixed PHP rates</li>
            <li>GCash or Maya</li>
            <li>Manual confirmation</li>
          </ul>
          <div className="hero__actions">
            <a className="hero-cta hero-cta--solid" href="#prices">
              View prices
            </a>
            <a
              className="hero-cta"
              href={CONTACT.facebookUrl}
              target="_blank"
              rel="noreferrer"
            >
              Message on Facebook
            </a>
          </div>
        </div>
      </section>

      <div className="price-ticker" aria-label="Per-rank prices">
        <div className="price-ticker__track">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1 ? "true" : undefined}
              className="price-ticker__group"
            >
              {climbRates.map(({ pip, price, route }) => (
                <span key={route} className="price-ticker__item">
                  <span
                    aria-hidden="true"
                    className={`rank-pip rank-pip--${pip}`}
                  />
                  {route} · {price}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section id="services" className="services-section">
        <div className="section-intro reveal">
          <p className="section-kicker">01 / LEAGUE ONLY SERVICES</p>
          <h2>One game. Every climb covered.</h2>
          <p>
            One game only: League of Legends on SEA. Solo, Duo, placements,
            promotions, per-rank climbs, and coaching. Pick a lane and start
            with a fixed quote.
          </p>
        </div>
        <div className="services-grid">
          {services.map((service, i) => (
            <article
              className="service-card reveal"
              key={service.title}
              style={{ "--reveal-delay": `${i * 60}ms` } as CSSProperties}
            >
              <div className="service-card__top">
                {service.badge ? (
                  <span className="service-badge">{service.badge}</span>
                ) : null}
                <span className="service-from">{service.from}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.blurb}</p>
              <a
                className="service-link"
                href="#contact"
                onClick={() => setSelectedService(service.title)}
                aria-label={`Start a ${service.title} inquiry`}
              >
                <span aria-hidden="true">→</span> Start inquiry
              </a>
            </article>
          ))}
        </div>
        <p className="services-note">
          We only cover Summoner&apos;s Rift on SEA. No Valorant, TFT, Wild
          Rift, or account sales.
        </p>
      </section>

      <section id="process" className="process-section">
        <div className="section-intro reveal">
          <p className="section-kicker">02 / HOW IT WORKS</p>
          <h2>Select. Pay. Rank up.</h2>
          <p>
            The same three-step handoff on every order — no region selector,
            no checkout maze, no mystery queue.
          </p>
        </div>
        <ol className="process-timeline">
          {steps.map((step, i) => (
            <li
              className="process-step reveal"
              key={step.index}
              style={{ "--reveal-delay": `${i * 70}ms` } as CSSProperties}
            >
              <span aria-hidden="true">{step.index}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
        <aside className="pay-strip reveal" aria-label="How GCash payment works">
          <div className="pay-strip__copy">
            <h3>Pay the manual way — GCash, confirmed in chat.</h3>
            <p>
              No card form lives on this site, and we never ask for PINs or
              login codes. Send only to the numbers below.
            </p>
          </div>
          <ol className="pay-strip__steps">
            <li>
              <strong>Lock the quote</strong>
              <span>We confirm total and timing in chat first.</span>
            </li>
            <li>
              <strong>Send via GCash or Maya</strong>
              <span>Straight to the number below — always confirm the total in chat first.</span>
            </li>
            <li>
              <strong>Share the receipt</strong>
              <span>Send the receipt screenshot and your climb starts.</span>
            </li>
          </ol>
          <div className="pay-numbers">
            <p>
              <span>GCash</span>
              <strong>{CONTACT.gcashNumber}</strong>
              <CopyButton text={CONTACT.gcashNumber} label="Copy" />
            </p>
            <p>
              <span>Maya</span>
              <strong>{CONTACT.mayaNumber}</strong>
              <CopyButton text={CONTACT.mayaNumber} label="Copy" />
            </p>
          </div>
        </aside>
      </section>

      <section id="prices" className="price-section">
        <div className="section-intro reveal">
          <p className="section-kicker">03 / PRICE BOARD</p>
          <h2>Pick your climb.</h2>
          <p>
            SEA server only. Choose a promotion package or price the climb by
            rank. Duo boosting adds 40% to the listed price.
          </p>
        </div>
        <div className="price-grid">
          <article className="price-panel reveal" aria-label="Promotion packages">
            <div className="panel-heading">
              <span>Promotion</span>
              <span>Fixed rate</span>
            </div>
            {rankPrices.map(({ pip, price, route }) => (
              <div className="price-row" key={route}>
                <span className="price-route">
                  <span
                    aria-hidden="true"
                    className={`rank-pip rank-pip--${pip}`}
                  />
                  {route}
                </span>
                <strong>{price}</strong>
              </div>
            ))}
            <a className="price-cta" href="#contact">
              Start an inquiry <span aria-hidden="true">→</span>
            </a>
          </article>
          <article
            className="price-panel price-panel--accent reveal"
            aria-label="Per-rank climb rates"
            style={{ "--reveal-delay": "80ms" } as CSSProperties}
          >
            <div className="panel-heading">
              <span>Per-rank climb</span>
              <span>From current rank</span>
            </div>
            {climbRates.map(({ pip, price, route }) => (
              <div className="price-row" key={route}>
                <span className="price-route">
                  <span
                    aria-hidden="true"
                    className={`rank-pip rank-pip--${pip}`}
                  />
                  {route}
                </span>
                <strong>{price}</strong>
              </div>
            ))}
            <a className="price-cta" href="#contact">
              Start an inquiry <span aria-hidden="true">→</span>
            </a>
          </article>
        </div>
        <div className="calc-panel reveal">
          <div className="panel-heading">
            <span>Climb calculator</span>
            <span>Estimate</span>
          </div>
          <div className="calc-controls">
            <label htmlFor="calc-current">
              Current rank
              <select
                id="calc-current"
                value={currentRank}
                onChange={(event) => setCurrentRank(event.target.value)}
              >
                {LADDER.map((rank) => (
                  <option key={rank} value={rank}>
                    {rank}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="calc-target">
              Target rank
              <select
                id="calc-target"
                value={targetRank}
                onChange={(event) => setTargetRank(event.target.value)}
              >
                {LADDER.map((rank) => (
                  <option key={rank} value={rank}>
                    {rank}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="calc-milestone">
              First payment covers up to
              <select
                id="calc-milestone"
                value={milestone}
                onChange={(event) => setMilestone(event.target.value)}
              >
                {LADDER.map((rank) => (
                  <option key={rank} value={rank}>
                    {rank}
                  </option>
                ))}
              </select>
            </label>
            <label className="calc-duo" htmlFor="calc-duo">
              <input
                id="calc-duo"
                type="checkbox"
                checked={duo}
                onChange={(event) => setDuo(event.target.checked)}
              />
              Duo (+40%)
            </label>
          </div>
          {split ? (
            split.leg2 ? (
              <div className="calc-split">
                <p>
                  <span>
                    Due now · {currentRank} → {milestone}
                  </span>
                  <strong>
                    PHP {split.leg1.total.toLocaleString("en-PH")}
                  </strong>
                </p>
                <p>
                  <span>
                    Due later · {milestone} → {targetRank}
                  </span>
                  <strong>
                    PHP {split.leg2.total.toLocaleString("en-PH")}
                  </strong>
                </p>
                <p className="calc-split__total">
                  <span>
                    Total climb · {split.leg1.steps + split.leg2.steps}{" "}
                    divisions · {duo ? "Duo rate" : "Solo rate"}
                  </span>
                  <strong>PHP {split.total.toLocaleString("en-PH")}</strong>
                </p>
              </div>
            ) : (
              <p className="calc-total">
                <strong>
                  PHP {split.total.toLocaleString("en-PH")}
                </strong>
                <span>
                  {currentRank} → {targetRank} · {split.leg1.steps}{" "}
                  {split.leg1.steps === 1 ? "division" : "divisions"} ·{" "}
                  {duo ? "Duo rate applied" : "Solo rate"}
                </span>
              </p>
            )
          ) : (
            <p className="calc-error" role="alert">
              {splitError}
            </p>
          )}
          <p className="calc-note">
            Can&apos;t cover the whole climb yet? Set “pay up to” to what your
            budget reaches now. Play starts on the first leg and the balance
            lands before the final push. We confirm the final quote on
            Facebook before play starts.
          </p>
        </div>
      </section>

      <section id="reviews" className="trust-section" aria-label="Why players trust">
        <div className="trust-copy reveal">
          <p className="section-kicker">04 / WHY PLAYERS TRUST</p>
          <h2>One server. Clear rules.</h2>
          <p>
            We only play on the SEA server. Confirm payment details with us
            first, and ask about queue and timing.
          </p>
        </div>
        <div className="trust-list reveal">
          <span>SEA server only</span>
          <span>GCash or Maya</span>
          <span>Manual order confirmation</span>
          <span>Progress updates</span>
        </div>
      </section>

      <section id="results" className="results-section" aria-label="Client results">
        <div className="section-intro reveal">
          <p className="section-kicker">05 / RECENT CLIMBS</p>
          <h2>Results players can check.</h2>
          <p>
            Every climb ends with a result screenshot we send to the client. A
            sample of recent orders lives here. The full trail is on our
            Facebook page.
          </p>
        </div>
        {testimonials.length > 0 ? (
          <>
            <div className="results-grid">
              {testimonials.map((review, i) => (
                <figure
                  className="result-card reveal"
                  key={review.detail}
                  style={{ "--reveal-delay": `${i * 60}ms` } as CSSProperties}
                >
                  {review.image ? (
                    <ResultImage
                      src={review.image}
                      alt={`Result screenshot: ${review.detail}`}
                    />
                  ) : null}
                  {review.quote ? (
                    <blockquote>{review.quote}</blockquote>
                  ) : null}
                  <figcaption>
                    {review.name ? <strong>{review.name}</strong> : null}
                    <span>{review.detail}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="services-note reveal">
              Full trail lives on Facebook — every climb ends with a result
              screenshot.{" "}
              <a className="service-link" href={CONTACT.facebookUrl} target="_blank" rel="noreferrer">
                <span aria-hidden="true">→</span> See all proofs
              </a>
            </p>
          </>
        ) : (
          <a
            className="results-fb reveal"
            href={CONTACT.facebookUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span>
              <strong>See recent result screenshots</strong>
              <span>Climb proofs posted on our Facebook page.</span>
            </span>
            <span aria-hidden="true">→</span>
          </a>
        )}
      </section>

      <section id="faq" className="faq-section" aria-label="Frequently asked questions">
        <div className="section-intro reveal">
          <p className="section-kicker">06 / QUESTIONS</p>
          <h2>Before you message.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <details
              className="faq-item reveal"
              key={faq.question}
              style={{ "--reveal-delay": `${i * 50}ms` } as CSSProperties}
              open={openFaq === i}
              onToggle={(event) => {
                if (event.currentTarget.open) setOpenFaq(i);
                else if (openFaq === i) setOpenFaq(null);
              }}
            >
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="section-intro reveal">
          <p className="section-kicker">07 / START AN INQUIRY</p>
          <h2>Tell us where to start.</h2>
          <p>
            Share the basics and continue on Facebook, Discord, or TikTok.
            We reply with your next step and final quote. No accounts, no
            card forms.
          </p>
        </div>
        <div className="channel-grid">
          <a
            className="channel-card reveal"
            href={CONTACT.facebookUrl}
            target="_blank"
            rel="noreferrer"
          >
            <strong>Facebook</strong>
            <span>Chat for quotes and order updates.</span>
            <span className="channel-go" aria-hidden="true">→</span>
          </a>
          <div className="channel-card reveal" style={{ "--reveal-delay": "70ms" } as CSSProperties}>
            <strong>Discord</strong>
            {CONTACT.discordHandles.map((handle) => (
              <span key={handle} className="channel-row">
                <span className="channel-handle">{handle}</span>
                <CopyButton text={handle} label="Copy" />
              </span>
            ))}
          </div>
          <a
            className="channel-card reveal"
            style={{ "--reveal-delay": "140ms" } as CSSProperties}
            href={CONTACT.tiktokUrl}
            target="_blank"
            rel="noreferrer"
          >
            <strong>TikTok</strong>
            <span className="channel-handle">{CONTACT.tiktokHandle}</span>
            <span className="channel-go" aria-hidden="true">→</span>
          </a>
        </div>
        <p className="channel-note">{CONTACT.replyNote}</p>
        <form
          ref={formRef}
          className="inquiry-form"
          onSubmit={(event) => event.preventDefault()}
          onChange={() => setFormValid(formRef.current?.checkValidity() ?? false)}
          aria-label="Boosting inquiry"
        >
          <label htmlFor="inquiry-name">
            Name
            <input
              id="inquiry-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your name"
            />
          </label>
          <label htmlFor="inquiry-contact">
            Contact handle
            <input
              id="inquiry-contact"
              name="contact"
              type="text"
              required
              autoComplete="off"
              placeholder="Facebook, Discord, or phone"
            />
          </label>
          <label htmlFor="inquiry-channel">
            Reach me fastest via
            <select
              id="inquiry-channel"
              name="channel"
              required
              value={channel}
              onChange={(event) => setChannel(event.target.value)}
            >
              <option value="Facebook">Facebook</option>
              <option value="Discord">Discord</option>
              <option value="TikTok">TikTok</option>
            </select>
          </label>
          {channel === "Discord" ? (
            <label htmlFor="inquiry-discord">
              Discord account
              <select
                id="inquiry-discord"
                name="discordAccount"
                required
                value={discordAccount}
                onChange={(event) => setDiscordAccount(event.target.value)}
              >
                {CONTACT.discordHandles.map((handle) => (
                  <option key={handle} value={handle}>
                    {handle}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label htmlFor="inquiry-service">
            Service
            <select
              id="inquiry-service"
              name="service"
              required
              value={selectedService}
              onChange={(event) => setSelectedService(event.target.value)}
            >
              <option value="Solo Boost">Solo Boost</option>
              <option value="Duo Boost">Duo Boost (+40%)</option>
              <option value="Placement Matches">Placement Matches</option>
              <option value="Promotion Package">Promotion Package</option>
              <option value="Per-Rank Climb">Per-Rank Climb</option>
              <option value="Coaching">Coaching</option>
            </select>
          </label>
          <label htmlFor="inquiry-current">
            Current rank
            <select
              id="inquiry-current"
              name="currentRank"
              required
              value={currentRank}
              onChange={(event) => setCurrentRank(event.target.value)}
            >
              {LADDER.map((rank) => (
                <option key={rank} value={rank}>
                  {rank}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="inquiry-target">
            Target rank
            <select
              id="inquiry-target"
              name="targetRank"
              required
              value={targetRank}
              onChange={(event) => setTargetRank(event.target.value)}
            >
              {LADDER.map((rank) => (
                <option key={rank} value={rank}>
                  {rank}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="inquiry-method">
            Payment method
            <select
              id="inquiry-method"
              name="payMethod"
              required
              value={payMethod}
              onChange={(event) => setPayMethod(event.target.value)}
            >
              <option value="GCash">GCash</option>
              <option value="Maya">Maya</option>
            </select>
          </label>
          <label htmlFor="inquiry-plan">
            Payment plan
            <select
              id="inquiry-plan"
              name="payPlan"
              required
              value={payPlan}
              onChange={(event) => {
                const plan = event.target.value;
                setPayPlan(plan);
                if (plan === "Full") setMilestone(targetRank);
              }}
            >
              <option value="Full">Full payment</option>
              <option value="Partial">Partial — staged climb</option>
            </select>
          </label>
          {payPlan === "Partial" ? (
            <label htmlFor="inquiry-milestone">
              First payment covers up to
              <select
                id="inquiry-milestone"
                name="milestone"
                required
                value={milestone}
                onChange={(event) => setMilestone(event.target.value)}
              >
                {LADDER.map((rank) => (
                  <option key={rank} value={rank}>
                    {rank}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label className="field-wide" htmlFor="inquiry-message">
            What do you need?
            <textarea
              id="inquiry-message"
              name="message"
              rows={4}
              placeholder="Example: bottom role only, plays Jinx and Aphelios, free weeknights after 7pm"
            />
          </label>
          <span className="form-actions field-wide">
            {splitError ? (
              <p className="form-error" role="alert">
                {splitError}
              </p>
            ) : null}
            {!splitError && !formValid ? (
              <p className="form-hint" role="status">
                Fill in your name and contact handle to continue.
              </p>
            ) : null}
            {channel === "Discord" ? (
              <CopyButton
                className="form-cta"
                text={discordAccount}
                label="Copy Discord username"
                disabled={blocked ? true : undefined}
              />
            ) : (
              <a
                className="form-cta"
                href={
                  channel === "TikTok"
                    ? CONTACT.tiktokUrl
                    : CONTACT.facebookUrl
                }
                target="_blank"
                rel="noreferrer"
                aria-disabled={blocked ? "true" : undefined}
                onClick={(event) => {
                  if (blocked) event.preventDefault();
                }}
              >
                Continue on {channel}
              </a>
            )}
            <button
              type="button"
              className="form-secondary"
              disabled={blocked ? true : undefined}
              onClick={copyDetails}
            >
              {copied ? "Copied ✓" : "Copy inquiry details"}
            </button>
            <span className="form-hint">
              Copy your details, then paste them into the chat on your
              chosen channel.
            </span>
          </span>
        </form>
      </section>

      <footer className="site-footer">
        <span>
          SEA Climbforge / League of Legends boosting — {year}. Not affiliated
          with Riot Games.
        </span>
        <span className="footer-links">
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#prices">Prices</a>
          <a href="#results">Results</a>
          <a href="#contact">Contact</a>
          <a
            href={CONTACT.facebookUrl}
            target="_blank"
            rel="noreferrer"
          >
            Message on Facebook
          </a>
        </span>
      </footer>

      <div className="mobile-cta" aria-label="Quick actions">
        <a className="mobile-cta__inquiry" href="#contact">
          Start an inquiry
        </a>
        <a
          className="mobile-cta__fb"
          href={CONTACT.facebookUrl}
          target="_blank"
          rel="noreferrer"
        >
          Message on Facebook
        </a>
      </div>
    </main>
  );
}
