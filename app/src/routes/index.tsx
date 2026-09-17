import { createFileRoute } from "@tanstack/react-router";

import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";

export const Route = createFileRoute("/")({
  component: Index,
});

const rankPrices = [
  ["Iron 1 to Bronze 4", "PHP 60"],
  ["Bronze 1 to Silver 4", "PHP 75"],
  ["Silver 1 to Gold 4", "PHP 105"],
  ["Gold 1 to Platinum 4", "PHP 175"],
  ["Platinum 1 to Emerald 4", "PHP 220"],
  ["Emerald 1 to Diamond 4", "PHP 270"],
  ["Diamond 1 to Master", "PHP 300"],
];

const climbRates = [
  ["Iron", "PHP 40 / rank"],
  ["Bronze", "PHP 65 / rank"],
  ["Silver", "PHP 80 / rank"],
  ["Gold", "PHP 95 / rank"],
  ["Platinum", "PHP 140 / rank"],
  ["Emerald", "PHP 235 / rank"],
  ["Diamond", "PHP 250 / rank"],
  ["Master", "PHP 350 / 100 LP"],
];

function Index() {
  return (
    <main className="rankforge-site">
      <header className="site-nav">
        <a className="brand-mark" href="#top" aria-label="SEA Rankforge home">
          <span className="brand-mark__crest">SR</span>
          <span>SEA Rankforge</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#prices">Prices</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="nav-cta" href="#contact">Start an inquiry</a>
      </header>

      <section id="top" className="journey-shell">
        <ScrollScrub scenes={scrollScrubScenes} theme={scrollScrubTheme} />
      </section>

      <section id="prices" className="price-section">
        <div className="section-intro">
          <p className="section-kicker">01 / PRICE BOARD</p>
          <h2>Pick your climb.</h2>
          <p>
            SEA server only. Choose a promotion package or price the climb by
            rank. Duo boosting adds 40% to the listed price.
          </p>
        </div>
        <div className="price-grid">
          <article className="price-panel">
            <div className="panel-heading">
              <span>Promotion</span>
              <span>Fixed rate</span>
            </div>
            {rankPrices.map(([label, price]) => (
              <div className="price-row" key={label}>
                <span>{label}</span>
                <strong>{price}</strong>
              </div>
            ))}
          </article>
          <article className="price-panel price-panel--accent">
            <div className="panel-heading">
              <span>Per-rank climb</span>
              <span>From current rank</span>
            </div>
            {climbRates.map(([label, price]) => (
              <div className="price-row" key={label}>
                <span>{label}</span>
                <strong>{price}</strong>
              </div>
            ))}
          </article>
        </div>
      </section>

      <section id="process" className="process-section">
        <div className="section-intro">
          <p className="section-kicker">02 / THE HANDOFF</p>
          <h2>Simple from first message to final screenshot.</h2>
        </div>
        <div className="process-grid">
          <div className="process-step">
            <span>01</span>
            <h3>Tell us your current rank</h3>
            <p>Send your current rank, target, queue preference, and availability.</p>
          </div>
          <div className="process-step">
            <span>02</span>
            <h3>Confirm the quote</h3>
            <p>We confirm the total, timing, and service details before starting.</p>
          </div>
          <div className="process-step">
            <span>03</span>
            <h3>Track the climb</h3>
            <p>Receive progress updates while your order is active.</p>
          </div>
        </div>
      </section>

      <section className="trust-section">
        <div className="trust-copy">
          <p className="section-kicker">03 / BEFORE YOU ORDER</p>
          <h2>Clear boundaries protect every climb.</h2>
          <p>
            We operate on the SEA server only. Never share your Riot password
            in a public message. Confirm the handoff and payment details with
            us first, and ask about the current queue and estimated timing.
          </p>
        </div>
        <div className="trust-list">
          <span>SEA server only</span>
          <span>GCash available</span>
          <span>Manual order confirmation</span>
          <span>Progress updates</span>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="section-intro">
          <p className="section-kicker">04 / START AN INQUIRY</p>
          <h2>Tell us where to start.</h2>
          <p>
            Share the basics and we will reply with the next step and a final
            quote.
          </p>
        </div>
        <form className="inquiry-form" action="mailto:boostingservices123@gmail.com" method="post" encType="text/plain">
          <label>
            Name
            <input name="name" type="text" required placeholder="Your name" />
          </label>
          <label>
            Contact handle
            <input name="contact" type="text" required placeholder="Facebook, Discord, or phone" />
          </label>
          <label>
            Current rank
            <input name="currentRank" type="text" required placeholder="Example: Gold 3" />
          </label>
          <label>
            Target rank
            <input name="targetRank" type="text" required placeholder="Example: Platinum 4" />
          </label>
          <label className="field-wide">
            What do you need?
            <textarea name="message" rows={4} placeholder="Promotion, per-rank climb, duo boosting, or another question" />
          </label>
          <button className="form-cta" type="submit">Send inquiry</button>
        </form>
      </section>

      <footer className="site-footer">
        <span>SEA Rankforge / League of Legends boosting</span>
        <a href="https://www.facebook.com/boostingservices123" target="_blank" rel="noreferrer">Message on Facebook</a>
      </footer>
    </main>
  );
}
