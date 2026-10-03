import { heroLogo } from './hero-logo.mjs';

const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export const homeContent = `
<section class="hero company-hero" aria-labelledby="hero-title">
  <div class="shell hero-grid">
    <div class="hero-copy">
      <p class="eyebrow"><span class="status-dot"></span> Digifender / Software &amp; cloud infrastructure</p>
      <h1 id="hero-title">Software. Systems.<br><span>Built around you.</span></h1>
      <p class="hero-lede">We build software, applications, and cloud infrastructure. From our own products to your next custom project, Digifender turns ideas into useful technology.</p>
      <div class="hero-actions"><a class="button button-bright" href="#contact">Let’s build something ${arrow}</a><a class="text-link light-link" href="#products">Explore our projects ${arrow}</a></div>
    </div>
    <div class="hero-art" aria-hidden="true">
      <div class="art-orbit orbit-one"></div><div class="art-orbit orbit-two"></div>
      ${heroLogo}
      <div class="art-caption"><span>IDEA</span><span class="caption-line"></span><span>BUILT</span></div>
    </div>
  </div>
  <div class="shell hero-bottom"><p>Independent thinking. Practical engineering.</p><span>Built for what’s next <span aria-hidden="true">↘</span></span></div>
</section>

<section id="about" class="shell section-pad capabilities-section" aria-labelledby="company-title">
  <div class="section-heading"><div><p class="eyebrow">01 / What we do</p><h2 id="company-title">From the first idea<br>to the systems behind it.</h2></div><p class="section-aside">An app, a workflow, an entire cloud environment.<br class="desktop-break"> Let’s work out what your project needs.</p></div>
  <div class="capability-grid">
    <article><span class="capability-icon" aria-hidden="true">&lt;/&gt;</span><h3>Software &amp; applications</h3><p>Websites, business tools, customer-facing apps, and custom software shaped around the people who use them.</p></article>
    <article><span class="capability-icon" aria-hidden="true"><svg viewBox="0 0 28 28" fill="none"><rect x="3" y="4" width="22" height="8" rx="2"/><rect x="3" y="16" width="22" height="8" rx="2"/><path d="M7 8h1m4 0h8M7 20h1m4 0h8"/></svg></span><h3>Cloud &amp; infrastructure</h3><p>The environments and services your software runs on, from deployment and hosting to the connections behind the scenes.</p></article>
    <article><span class="capability-icon" aria-hidden="true"><svg viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="18" y="18" width="7" height="7" rx="1"/><path d="M10 6h8a4 4 0 0 1 4 4v8M18 22h-8a4 4 0 0 1-4-4v-8"/></svg></span><h3>Integrations &amp; automation</h3><p>Connect your services, put repetitive work into code, and build the missing pieces between the tools you already have.</p></article>
  </div>
</section>

<section id="products" class="portfolio-section" aria-labelledby="projects-title"><div class="shell section-pad">
  <div class="section-heading"><div><p class="eyebrow">02 / Digifender projects</p><h2 id="projects-title">Different ideas.<br>The same drive to build.</h2></div><p class="section-aside">Explore three projects from Digifender,<br class="desktop-break"> each with a purpose of its own.</p></div>
  <div class="project-stack">
    <article class="project-showcase project-whumpo" aria-labelledby="whumpo-title">
      <div class="showcase-copy"><p class="showcase-category">01 / AI-assisted creation</p><h3 id="whumpo-title">Whumpo<span>.</span></h3><p class="showcase-tagline">From conversation to creation.</p><p class="showcase-description">A workspace for creating websites and small applications through chat. Shape a draft, review your changes, and decide when to share.</p><a class="button button-dark" href="https://whumpo.com">Explore Whumpo ${arrow}</a><p class="showcase-status">In active development · Invitation-only preview</p><a class="showcase-policy" href="/legal/whumpo">Whumpo draft policies</a></div>
      <div class="showcase-art whumpo-art" aria-hidden="true"><div class="showcase-orbit"></div><svg viewBox="0 0 440 330" fill="none"><g transform="rotate(5 242 186)"><rect x="114" y="76" width="262" height="214" rx="10" fill="#FAFCFF" stroke="#A4BCD2"/><path d="M114 104h262" stroke="#C9D7E5"/><circle cx="131" cy="90" r="3" fill="#A1B7CF"/><circle cx="142" cy="90" r="3" fill="#A1B7CF"/><circle cx="153" cy="90" r="3" fill="#A1B7CF"/><rect x="140" y="130" width="164" height="14" rx="3" fill="#34506C"/><rect x="140" y="154" width="113" height="14" rx="3" fill="#34506C"/><rect x="140" y="183" width="191" height="5" rx="2" fill="#B6CADD"/><rect x="140" y="195" width="157" height="5" rx="2" fill="#B6CADD"/><rect x="140" y="221" width="56" height="43" rx="5" fill="#AADBCF"/><rect x="207" y="221" width="56" height="43" rx="5" fill="#F5D896"/><rect x="274" y="221" width="56" height="43" rx="5" fill="#ABC4E6"/></g><g transform="rotate(-5 125 81)"><rect x="44" y="36" width="180" height="84" rx="9" fill="#10223A"/><path d="M62 67h108M62 83h76" stroke="#A9E7DD" stroke-width="6" stroke-linecap="round"/><path d="m73 119 15 17 10-17" fill="#10223A"/><path d="m196 49 2 9 9 2-9 2-2 9-2-9-9-2 9-2 2-9Z" fill="#D2F573"/></g></svg><span class="showcase-art-label">An idea, taking shape.</span></div>
    </article>
    <article class="project-showcase project-chapel" aria-labelledby="chapel-title">
      <div class="showcase-copy"><p class="showcase-category">02 / Church software &amp; IT</p><h3 id="chapel-title">ChapelCloud<span>.</span></h3><p class="showcase-tagline">Church technology, brought together.</p><p class="showcase-description">Church software, connected systems, and technical support. From congregation operations to sanctuary technology, tools and services for church teams.</p><a class="button button-dark" href="https://chapel.cloud">Explore ChapelCloud ${arrow}</a><p class="showcase-status">Software, systems, and technical support</p><div class="showcase-links"><a class="showcase-inquiry" href="mailto:hello@digifender.com?subject=ChapelCloud%20inquiry">Ask Digifender about ChapelCloud</a><a class="showcase-policy" href="/legal/chapelcloud">ChapelCloud draft policies</a></div></div>
      <div class="showcase-art chapel-art" aria-hidden="true"><div class="showcase-orbit"></div><svg viewBox="0 0 440 330" fill="none"><path d="M110 254V146a110 110 0 0 1 220 0v108H110Z" fill="#DFD2BF"/><path d="M143 254V147a77 77 0 0 1 154 0v107H143Z" fill="#FAF7F0"/><path d="M174 254V148a46 46 0 0 1 92 0v106h-92Z" fill="#2C534B"/><path d="M219 70v184M151 116h138M141 155h158" stroke="#C6B491" stroke-width="2"/><path d="M184 147h74M219 111v84" stroke="#F0D994" stroke-width="2"/><circle cx="89" cy="98" r="8" fill="#BC8656"/><path d="M81 276h278" stroke="#CBBDA4" stroke-width="2"/></svg><span class="showcase-art-label">Space for connection.</span></div>
    </article>
    <article class="project-showcase project-lab" aria-labelledby="lab-title">
      <div class="showcase-copy"><p class="showcase-category">03 / Home lab learning</p><h3 id="lab-title">LabThrift<span>.</span></h3><p class="showcase-tagline">Make more of the hardware you have.</p><p class="showcase-description">A practical starting point for your first home lab. Find plain-English guides, explore sensible hardware and networking choices, and learn by building.</p><a class="button button-dark" href="https://labthrift.com">Explore LabThrift ${arrow}</a><p class="showcase-status">Guides, planning tools, and hands-on learning</p><a class="showcase-policy" href="/legal/labthrift">LabThrift draft policies</a></div>
      <div class="showcase-art lab-art" aria-hidden="true"><div class="showcase-orbit"></div><svg viewBox="0 0 440 330" fill="none"><path d="M114 246h57m98 0h57M220 214v32m-49 0h98" stroke="#BE885E" stroke-width="2"/><rect x="97" y="82" width="246" height="49" rx="7" fill="#293C38"/><rect x="97" y="145" width="246" height="49" rx="7" fill="#293C38"/><rect x="97" y="208" width="246" height="49" rx="7" fill="#293C38"/><path d="M120 106h51m-51 64h51m-51 63h51" stroke="#AFCAB2" stroke-width="5" stroke-linecap="round"/><circle cx="291" cy="106" r="4" fill="#C6E192"/><circle cx="307" cy="106" r="4" fill="#C6E192"/><circle cx="291" cy="170" r="4" fill="#C6E192"/><circle cx="307" cy="170" r="4" fill="#C6E192"/><circle cx="291" cy="233" r="4" fill="#C6E192"/><circle cx="307" cy="233" r="4" fill="#C6E192"/><g transform="rotate(-8 91 73)"><rect x="46" y="40" width="95" height="50" rx="5" fill="#E4AD74"/><path d="m64 56 9 9-9 9m19 0h19" stroke="#493623" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g></svg><span class="showcase-art-label">Curiosity. Meet capability.</span></div>
    </article>
  </div>
</div></section>

<section id="contact" class="partnership-section" aria-labelledby="contact-title"><div class="shell partnership-grid">
  <div class="partnership-copy"><p class="eyebrow">03 / Let’s work together</p><h2 id="contact-title">Something custom?<br><span>Let’s build it.</span></h2><p>Bring us the problem, the plan, or the idea. We’re open to custom software projects, cloud infrastructure work, and partnerships that need someone to connect the dots and write the code.</p><div class="partnership-actions"><a class="button button-bright" href="mailto:hello@digifender.com?subject=Let%E2%80%99s%20build%20something">Tell us about your project ${arrow}</a><a class="text-link light-link" href="tel:+18336339838">(833) 633-9838</a></div></div>
  <div class="partnership-detail"><span class="partnership-glyph" aria-hidden="true">↗</span><p class="eyebrow">A good place to start</p><p>What do you want to make?<br>What’s getting in the way?<br>Where could we help?</p><a href="mailto:hello@digifender.com">hello@digifender.com</a></div>
</div></section>

<div class="shell legal-tail"><p>Company notices and product policies, in one place.</p><a class="text-link" href="/legal">Visit the legal hub ${arrow}</a></div>`;
