import {header,footer} from './pages.mjs';
// Prices are the current customer prices from the owner's pricing sheet. Owner content still to supply is marked PLACEHOLDER on the page itself.
const Q='Quote on request';
const addOns=[
 ['Domain and account',[
  ['Custom domain registration and management','We register and manage your domain, in your name.','Included'],
  ['Hosting, SSL and backups','Static hosting for your site.','Included'],
  ['Business email setup','Mailboxes and phone setup, including the DNS work.','$49 setup · Pass-through or $10/user/mo'],
  ['Extra pages','Additional pages on a template.','$25/page'],
  ['Site migration','Move a site from another builder, with domain and email transfer.','$99 setup'],
  ['Self-edit content dashboard','Edit your own content in a simple dashboard.','$99 setup · $5/mo'],
  ['Analytics setup and a periodic report','One place for website and listing insights, reviewed with your rep.','$0 setup · $10/mo'],
  ['Content updates','Small text, photo and hours changes, by request, billed in 15-minute increments.','$50/hr'],
  ['Update Pack','One hour of prepaid edits a month, rolls over one month.','$29/mo'],
  ['Priority support','Same-business-day edits for subscribers.','$10/mo']]],
 ['Lead capture and communication',[
  ['Contact form','A contact form with spam protection.','$25 setup · No monthly fee'],
  ['Quote or estimate request form','Photo upload and alerts included.','$75 setup · $5/mo'],
  ['Intake and new-client forms','Collect details from new clients before you meet.','$150 setup · $10/mo'],
  ['Click-to-call and click-to-text bar','A call and text bar for phones.','Included'],
  ['Missed-call text-back','An automatic text to callers you could not answer.','$49 setup · $29/mo'],
  ['Live chat','Chat routed to your phone or inbox, if you will answer it.','$49 setup · No monthly fee'],
  ['Website chat assistant','Answers questions about your site\'s own information, with handoff to phone or form.','$99 setup · $19/mo'],
  ['AI receptionist setup','Set up through a partner service.','$99 setup · Pass-through plus $20–$50/mo management'],
  ['Newsletter and text signup widget','Let visitors sign up for your newsletter or texts.','$25 setup']]],
 ['Booking, reservations and scheduling',[
  ['Online booking embed','For supported scheduling tools.','$49 setup · No monthly fee'],
  ['Restaurant reservations or waitlist link','Link visitors to your reservations or waitlist.','$25 setup'],
  ['Class and event registration','Registration with payment.','$99 setup · $10/mo'],
  ['Deposits and no-show protection','Set up in your booking tool.','$49 setup']]],
 ['Commerce, ordering and payments',[
  ['Online ordering integration','Works with your existing ordering platform: order buttons, menu sync checks and ordering links.','$99 setup · $10/mo'],
  ['Direct-ordering setup','Help taking orders without third-party delivery apps.','$49 setup'],
  ['Product catalog','A catalog of your products, without checkout.','$99 setup · Edits through the Update Pack'],
  ['Online store setup','Sell your products online. Up to 25 products, then $5 per product.','$199 setup · $15/mo'],
  ['Gift cards','Offer gift cards to your customers.','$49 setup'],
  ['Payment links, invoices and deposits','Through a hosted payment provider.','$49 setup'],
  ['Loyalty program page','A page that explains your loyalty program.','$49 setup'],
  ['Catering request form','Let customers request catering online, with an HTML catering menu.','$75 setup']]],
 ['Content and pages',[
  ['HTML menu page','A real web page menu, not a PDF, with updates.','$49 setup · Menu Care $10/mo or $25/update'],
  ['Blog or news section','Share news and posts on your site.','$99 setup'],
  ['Blog posts written with your approval','We write, you approve.','$50/post, or $49/mo for 1 post a month'],
  ['Photo gallery, portfolio, or before-and-after page','Show your work.','$49 setup · Edits through the Update Pack'],
  ['Events calendar','List your upcoming events.','$75 setup · $10/mo'],
  ['Specials and seasonal promo banners','Highlight current offers on your site. Included in the Update Pack.','$25/change'],
  ['Coupon or promo landing page','With a QR code.','$49/campaign'],
  ['Careers page','With an application form.','$75 setup · No monthly fee'],
  ['Reviews widget','Shows live reviews on your site.','$49 setup · No monthly fee'],
  ['Service-area pages','Pages for the areas you serve.','$50/page'],
  ['FAQ page','Answer common questions in one place.','$25 setup'],
  ['Team and staff bios','Introduce your people.','$25/person'],
  ['Other language versions','Spanish or other languages, human-reviewed.','$150 for 5 pages, or $25/page · +25% on updates']]],
 ['Local visibility',[
  ['Business profile setup and optimization','On the major search and map listing: categories, services, photos, hours, and links.','$99 setup'],
  ['Ongoing business profile management','Regular posts, photo uploads, holiday hours, questions, and review replies.','$39/mo'],
  ['Other listings','Setup on other major map, search and neighbourhood listings.','$49 setup'],
  ['Citation building','Consistent listings across directories.','$99 setup'],
  ['On-page local SEO','Titles, business data markup, and consistent name, address and phone details.','$99 setup'],
  ['Ongoing local search checks','Regular rank checks and one page improvement a month.','$99/mo'],
  ['Review-generation kit','A short review link, QR cards, message templates and a staff script.','$49 setup'],
  ['Automated review requests','By text or email after a visit or job.','$49 setup · $29/mo'],
  ['Review response management','We help you respond to reviews, up to about 20 a month.','$29/mo']]],
 ['Marketing',[
  ['Email newsletter setup','Signup form and template.','$75 setup'],
  ['Newsletter, done for you','We prepare your newsletter on a regular basis.','$49/send'],
  ['Text marketing setup','Opt-in and consent handling, and regular messages.','$99 setup · $29/mo plus 2–3¢/text'],
  ['Social links, feed embed and share previews','Connect your site to your social accounts.','$25 setup'],
  ['Social media posting','One platform, 8 posts a month.','$99/mo'],
  ['Local advertising setup','Search and local service listings.','$149 setup'],
  ['Ad campaign management','We run your search ad campaigns. You pay the ad spend.','$99/mo'],
  ['Social ad boost management','We run your boosted social posts. You pay the ad spend.','$99/mo'],
  ['Campaign landing pages','A page built for each campaign.','$99 setup · No monthly fee'],
  ['QR codes','For menus, reviews, ordering and Wi-Fi.','Free'],
  ['Print design','Cards, flyers and table tents. Printing at cost plus 20–30%.','$49/piece']]],
 ['Creative',[
  ['Smartphone photo session','With 20 edited photos.','$49 setup'],
  ['Professional photography','Arranged through a local photographer.','$250 setup'],
  ['Copywriting for pages','We write the words for your pages.','$25/page or $99 full site'],
  ['Logo design','A logo for your business.','$99 setup'],
  ['Brand kit','Logo, colours, fonts and templates.','$199 setup'],
  ['Short promo video or social reels pack','Short video for your promotions.','$99 setup']]],
 ['Compliance and accessibility',[
  ['Accessibility baseline on every build','Built following WCAG 2.1 AA practices: alt text, colour contrast, keyboard navigation, HTML menus and labelled forms.','Included'],
  ['Accessibility audit and fixes','For an existing or inherited site.','$149 setup'],
  ['Ongoing accessibility checks','After content changes.','$10/mo'],
  ['Privacy policy, cookie notice and terms templates','Templates only. These are not legal advice.','$25 setup']]],
 ['Advanced',[
  ['Client portal or member area','Built on an off-the-shelf tool.','$500 setup · $25/mo'],
  ['Customer accounts and order history','Through a platform feature.',Q],
  ['Integrations and automation','Such as form to spreadsheet or CRM.','$99 setup · $10/mo']]]
];
const steps=[
 ['Talk to your rep','Your sales rep meets you in person and learns what your site needs.'],
 ['Pick what you need','Your rep walks you through the basic site and the add-ons, and shows you what applies.'],
 ['Get your quote','Prices for add-ons are listed on this page. Your rep can add them to your quote.'],
 ['Stay in touch','Your rep stays your point of contact for your hosting.']
];
const faq=[
 ['What does the base price cover?','PLACEHOLDER: owner to answer. See "What the base price covers" above for what is stated so far.'],
 ['How much do add-ons cost?','Each add-on lists its current price on this page. Your sales rep can confirm which ones fit your site.'],
 ['Can I move to a premium or bespoke site later?','PLACEHOLDER: owner to answer.'],
 ['What happens if I want to stop?','PLACEHOLDER: owner to answer.'],
 ['Who do I contact for support?','Your sales rep is your point of contact. PLACEHOLDER: owner to add any other support route.']
];
const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M12 5l7 7-7 7"/></svg>';
// Header/footer are shared with the homepage; their in-page anchors must point back at "/" from this page.
const shared=html=>html.replace(/href="#(?!home"|main")/g,'href="/#').replace('<a href="/managed-hosting">','<a href="/managed-hosting" aria-current="page">');
export function renderManagedHosting(variant,{css}) {
 const title='Managed hosting — Digifender';
 const desc='Managed hosting from Digifender: what the base price covers and the add-ons with their current prices.';
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${desc}"><link rel="canonical" href="https://digifender.com/managed-hosting"><meta name="robots" content="index,follow"><meta name="theme-color" content="#09172b"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="preload" href="/assets/manrope.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="/assets/${css}"></head><body class="design-${variant} subpage">${shared(header())}<main id="main">
<section class="section hosting-hero" id="home" aria-labelledby="hosting-heading"><div class="container"><p class="eyebrow">Managed hosting</p><h1 id="hosting-heading">We host your website, so you do not have to.</h1><p class="hosting-lede">Managed hosting means we run the place your website lives and look after it for you. Your sales rep is your point of contact. Ask them anything on this page.</p><p class="hosting-area">Currently serving Val Verde, TX.</p><p class="hosting-note">This page goes with your conversation with your rep. It lists what we offer so your rep can point to it.</p></div></section>
<section class="section hosting-section" id="included" aria-labelledby="included-heading"><div class="container"><p class="eyebrow">Basic sites</p><h2 id="included-heading">What the base price covers</h2><p class="hosting-note">The base price covers hosting for basic sites only. Premium and bespoke sites are not covered by the base price.</p><div class="hosting-card hosting-base"><p class="hosting-label">Base price</p><p class="placeholder hosting-big">PLACEHOLDER: base price (owner to confirm for new basic customers)</p><p class="placeholder">PLACEHOLDER: list of what the base price includes, to be supplied by the owner.</p></div></div></section>
<section class="section hosting-section" id="add-ons" aria-labelledby="addons-heading"><div class="container"><p class="eyebrow">Add-ons</p><h2 id="addons-heading">Add-ons you can ask for</h2><p class="hosting-note">Anything beyond the base price comes with an additional cost. Listed prices are current customer prices. Premium and bespoke sites are quoted separately. Third-party platform fees are paid by you directly to the provider.</p><p class="hosting-note">Add-on availability depends on your site. Your rep will recommend what fits.</p><div class="hosting-grid">${addOns.map(([cat,items])=>`<section class="hosting-card" aria-label="${cat}"><h3>${cat}</h3><ul>${items.map(([n,d,p])=>`<li><p class="hosting-name">${n}</p><p class="hosting-desc">${d}</p><p class="hosting-quote">${p}</p></li>`).join('')}</ul></section>`).join('')}</div></div></section>
<section class="section hosting-section" id="how" aria-labelledby="how-heading"><div class="container"><p class="eyebrow">How it works</p><h2 id="how-heading">How it works with your rep</h2><ol class="hosting-steps">${steps.map(([t,x],i)=>`<li class="hosting-card"><span class="hosting-step" aria-hidden="true">0${i+1}</span><h3><span class="sr-only">Step ${i+1}: </span>${t}</h3><p class="hosting-desc">${x}</p></li>`).join('')}</ol></div></section>
<section class="section hosting-section" id="site-types" aria-labelledby="types-heading"><div class="container"><p class="eyebrow">Site types</p><h2 id="types-heading">Basic site or premium site</h2><div class="hosting-grid hosting-two"><article class="hosting-card"><h3>Basic site</h3><p class="hosting-desc">Covered by the base price.</p></article><article class="hosting-card"><h3>Premium or bespoke site</h3><p class="hosting-desc">Not covered by the base price. Premium and bespoke sites are quoted separately by your sales rep.</p></article></div></div></section>
<section class="section hosting-section" id="faq" aria-labelledby="faq-heading"><div class="container"><p class="eyebrow">Questions</p><h2 id="faq-heading">Frequently asked questions</h2><div class="hosting-faq">${faq.map(([q,a])=>`<details><summary>${q}</summary><p class="hosting-desc">${a}</p></details>`).join('')}</div></div></section>
<section class="contact-section section" id="contact" aria-labelledby="contact-heading"><div class="container"><h2 id="contact-heading">Talk to your rep</h2><p class="hosting-note">Ask your sales rep about managed hosting, add-ons, or a premium site. They can go over the prices on this page with you.</p><div class="hosting-call"><a class="button" href="tel:+18336339838"><span>Call Digifender</span>${arrow}</a><span class="hosting-phone">(833) 633-9838</span></div><p class="placeholder">PLACEHOLDER: contact details (email, address) to be supplied by the owner.</p></div></section>
</main>${shared(footer())}</body></html>`;
}
