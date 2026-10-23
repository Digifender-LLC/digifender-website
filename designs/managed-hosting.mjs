import {header,footer} from './pages.mjs';
// Owner content still to supply is marked PLACEHOLDER on the page itself. tools/verify-managed-hosting.mjs fails if a price or currency amount appears.
const addOns=[
 ['Domain and account',[
  ['Custom domain registration and management','We register and manage your domain, in your name.'],
  ['Business email setup','Mailboxes and phone setup, including the DNS work.'],
  ['Extra pages','Additional pages on a template.'],
  ['Site migration','Move a site from another builder, with domain and email transfer.'],
  ['Self-edit content dashboard','Edit your own content in a simple dashboard.'],
  ['Analytics setup and a periodic report','One place for website and listing insights, reviewed with your rep.'],
  ['Content updates','Small text, photo and hours changes, by request, or through a prepaid update plan.'],
  ['Priority support','Faster edit turnaround for subscribers.']]],
 ['Lead capture and communication',[
  ['Contact form','A contact form with spam protection.'],
  ['Quote or estimate request form','Photo upload and alerts included.'],
  ['Intake and new-client forms','Collect details from new clients before you meet.'],
  ['Click-to-call and click-to-text bar','A call and text bar for phones.'],
  ['Missed-call text-back','An automatic text to callers you could not answer.'],
  ['Live chat','Chat routed to your phone or inbox, if you will answer it.'],
  ['Website chat assistant','Answers questions about your site\'s own information, with handoff to phone or form.'],
  ['AI receptionist setup','Set up through a partner service.'],
  ['Newsletter and text signup widget','Let visitors sign up for your newsletter or texts.']]],
 ['Booking, reservations and scheduling',[
  ['Online booking embed','For supported scheduling tools.'],
  ['Restaurant reservations or waitlist link','Link visitors to your reservations or waitlist.'],
  ['Class and event registration','Registration with payment.'],
  ['Deposits and no-show protection','Set up in your booking tool.']]],
 ['Commerce, ordering and payments',[
  ['Online ordering integration','Works with your existing ordering platform: order buttons, menu sync checks and ordering links.'],
  ['Direct-ordering setup','Help taking orders without third-party delivery apps.'],
  ['Product catalog','A catalog of your products, without checkout.'],
  ['Online store setup','Sell your products online.'],
  ['Gift cards','Offer gift cards to your customers.'],
  ['Payment links, invoices and deposits','Through a hosted payment provider.'],
  ['Loyalty program page','A page that explains your loyalty program.'],
  ['Catering request form','Let customers request catering online.']]],
 ['Content and pages',[
  ['HTML menu page','A real web page menu, not a PDF, with updates.'],
  ['Blog or news section','Share news and posts on your site.'],
  ['Blog posts written with your approval','We write, you approve.'],
  ['Photo gallery, portfolio, or before-and-after page','Show your work.'],
  ['Events calendar','List your upcoming events.'],
  ['Specials and seasonal promo banners','Highlight current offers on your site.'],
  ['Coupon or promo landing page','With a QR code.'],
  ['Careers page','With an application form.'],
  ['Reviews widget','Shows live reviews on your site.'],
  ['Service-area pages','Pages for the areas you serve.'],
  ['FAQ page','Answer common questions in one place.'],
  ['Team and staff bios','Introduce your people.'],
  ['Other language versions','Spanish or other languages, human-reviewed.']]],
 ['Local visibility',[
  ['Business profile setup and optimization','On the major search and map listing: categories, services, photos, hours, and links.'],
  ['Ongoing business profile management','Regular posts, photo uploads, holiday hours, questions, and review replies.'],
  ['Other listings','Setup on other major map, search and neighbourhood listings.'],
  ['Citation building','Consistent listings across directories.'],
  ['On-page local SEO','Titles, business data markup, and consistent name, address and phone details.'],
  ['Ongoing local search checks','Regular checks and improvements.'],
  ['Review-generation kit','A short review link, QR cards, message templates and a staff script.'],
  ['Automated review requests','By text or email after a visit or job.'],
  ['Review response management','We help you respond to reviews.']]],
 ['Marketing',[
  ['Email newsletter setup','Signup form and template.'],
  ['Newsletter, done for you','We prepare your newsletter on a regular basis.'],
  ['Text marketing setup','Opt-in and consent handling, and regular messages.'],
  ['Social links, feed embed and share previews','Connect your site to your social accounts.'],
  ['Social media posting','Posting on a platform of your choice.'],
  ['Local advertising setup','Search and local service listings.'],
  ['Ad campaign management','We run your campaigns.'],
  ['Campaign landing pages','A page built for each campaign.'],
  ['QR codes','For menus, reviews, ordering and Wi-Fi.'],
  ['Print design','Cards, flyers and table tents.']]],
 ['Creative',[
  ['Smartphone photo session','With edited photos.'],
  ['Professional photography','Arranged through a local photographer.'],
  ['Copywriting for pages','We write the words for your pages.'],
  ['Logo design','A logo for your business.'],
  ['Brand kit','Logo, colours, fonts and templates.'],
  ['Short promo video or social reels pack','Short video for your promotions.']]],
 ['Compliance and accessibility',[
  ['Accessibility baseline on every build','Built following WCAG 2.1 AA practices: alt text, colour contrast, keyboard navigation, HTML menus and labelled forms.'],
  ['Accessibility audit and fixes','For an existing or inherited site.'],
  ['Ongoing accessibility checks','After content changes.'],
  ['Privacy policy, cookie notice and terms templates','Templates only. These are not legal advice.']]],
 ['Advanced',[
  ['Client portal or member area','Built on an off-the-shelf tool.'],
  ['Customer accounts and order history','Through a platform feature.'],
  ['Integrations and automation','Such as form to spreadsheet or CRM.']]]
];
const steps=[
 ['Talk to your rep','Your sales rep meets you in person and learns what your site needs.'],
 ['Pick what you need','Your rep walks you through the basic site and the add-ons, and shows you what applies.'],
 ['Get your quote','Anything beyond the base price is quoted in person by your rep.'],
 ['Stay in touch','Your rep stays your point of contact for your hosting.']
];
const faq=[
 ['What does the base price cover?','PLACEHOLDER: owner to answer. See "What the base price covers" above for what is stated so far.'],
 ['How much do add-ons cost?','Add-ons are quoted in person by your sales rep. There is no price list on this page.'],
 ['Can I move to a premium or bespoke site later?','PLACEHOLDER: owner to answer.'],
 ['What happens if I want to stop?','PLACEHOLDER: owner to answer.'],
 ['Who do I contact for support?','Your sales rep is your point of contact. PLACEHOLDER: owner to add any other support route.']
];
const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M12 5l7 7-7 7"/></svg>';
// Header/footer are shared with the homepage; their in-page anchors must point back at "/" from this page.
const shared=html=>html.replace(/href="#(?!home"|main")/g,'href="/#').replace('<a href="/managed-hosting">','<a href="/managed-hosting" aria-current="page">');
export function renderManagedHosting(variant,{css}) {
 const title='Managed hosting — Digifender';
 const desc='Managed hosting from Digifender: what the base price covers and the add-ons your sales rep can quote in person.';
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${desc}"><link rel="canonical" href="https://digifender.com/managed-hosting"><meta name="robots" content="index,follow"><meta name="theme-color" content="#09172b"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="preload" href="/assets/manrope.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="/assets/${css}"></head><body class="design-${variant} subpage">${shared(header())}<main id="main">
<section class="section hosting-hero" id="home" aria-labelledby="hosting-heading"><div class="container"><p class="eyebrow">Managed hosting</p><h1 id="hosting-heading">We host your website, so you do not have to.</h1><p class="hosting-lede">Managed hosting means we run the place your website lives and look after it for you. Your sales rep is your point of contact. Ask them anything on this page.</p><p class="hosting-area">Currently serving Val Verde, TX.</p><p class="hosting-note">This page goes with your conversation with your rep. It lists what we offer so your rep can point to it.</p></div></section>
<section class="section hosting-section" id="included" aria-labelledby="included-heading"><div class="container"><p class="eyebrow">Basic sites</p><h2 id="included-heading">What the base price covers</h2><p class="hosting-note">The base price covers hosting for basic sites only. Premium and bespoke sites are not covered by the base price.</p><div class="hosting-card hosting-base"><p class="hosting-label">Base price</p><p class="placeholder hosting-big">PLACEHOLDER: base price to be supplied by the owner</p><p class="placeholder">PLACEHOLDER: list of what the base price includes, to be supplied by the owner.</p></div></div></section>
<section class="section hosting-section" id="add-ons" aria-labelledby="addons-heading"><div class="container"><p class="eyebrow">Add-ons</p><h2 id="addons-heading">Add-ons you can ask for</h2><p class="hosting-note">Anything beyond the base price comes with an additional cost. Costs are quoted in person by your sales rep.</p><p class="hosting-note">Add-on availability depends on your site. Your rep will recommend what fits, and quote the cost in person.</p><div class="hosting-grid">${addOns.map(([cat,items])=>`<section class="hosting-card" aria-label="${cat}"><h3>${cat}</h3><ul>${items.map(([n,d])=>`<li><p class="hosting-name">${n}</p><p class="hosting-desc">${d}</p><p class="hosting-quote">Quoted in person</p></li>`).join('')}</ul></section>`).join('')}</div></div></section>
<section class="section hosting-section" id="how" aria-labelledby="how-heading"><div class="container"><p class="eyebrow">How it works</p><h2 id="how-heading">How it works with your rep</h2><ol class="hosting-steps">${steps.map(([t,x],i)=>`<li class="hosting-card"><span class="hosting-step" aria-hidden="true">0${i+1}</span><h3><span class="sr-only">Step ${i+1}: </span>${t}</h3><p class="hosting-desc">${x}</p></li>`).join('')}</ol></div></section>
<section class="section hosting-section" id="site-types" aria-labelledby="types-heading"><div class="container"><p class="eyebrow">Site types</p><h2 id="types-heading">Basic site or premium site</h2><div class="hosting-grid hosting-two"><article class="hosting-card"><h3>Basic site</h3><p class="hosting-desc">Covered by the base price.</p></article><article class="hosting-card"><h3>Premium or bespoke site</h3><p class="hosting-desc">Not covered by the base price. Premium and bespoke sites are quoted separately, in person, by your sales rep.</p></article></div></div></section>
<section class="section hosting-section" id="faq" aria-labelledby="faq-heading"><div class="container"><p class="eyebrow">Questions</p><h2 id="faq-heading">Frequently asked questions</h2><div class="hosting-faq">${faq.map(([q,a])=>`<details><summary>${q}</summary><p class="hosting-desc">${a}</p></details>`).join('')}</div></div></section>
<section class="contact-section section" id="contact" aria-labelledby="contact-heading"><div class="container"><h2 id="contact-heading">Talk to your rep</h2><p class="hosting-note">Ask your sales rep about managed hosting, add-ons, or a premium site. They will quote any extra costs in person.</p><div class="hosting-call"><a class="button" href="tel:+18336339838"><span>Call Digifender</span>${arrow}</a><span class="hosting-phone">(833) 633-9838</span></div><p class="placeholder">PLACEHOLDER: contact details (email, address) to be supplied by the owner.</p></div></section>
</main>${shared(footer())}</body></html>`;
}
