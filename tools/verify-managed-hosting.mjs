// Managed hosting page: placeholders present, no prices or invented claims, one h1, "Quoted in person" on every add-on. Run after `pnpm build`.
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
for (const variant of ['signal','blueprint']) {
 const dir=new URL(`../designs/releases/${variant}/public/`,import.meta.url);
 const html=await readFile(new URL('managed-hosting.html',dir),'utf8');
 const home=await readFile(new URL('index.html',dir),'utf8');
 const main=html.split('<main')[1].split('</main>')[0];
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
 const addOnSection=main.split('id="add-ons"')[1].split('id="how"')[0];
 const items=(addOnSection.match(/<li>/g)||[]).length;
 assert.ok(items>50);
 assert.equal((main.match(/Quoted in person/g)||[]).length,items);
 assert.ok(addOnSection.includes('Add-on availability depends on your site.'));
 for (const p of ['PLACEHOLDER: base price','PLACEHOLDER: list of what the base price includes','PLACEHOLDER: contact details (email, address)'])assert.ok(main.includes(p),p);
 assert.equal((main.match(/PLACEHOLDER: owner to (?:answer|add)/g)||[]).length,4);
 assert.ok(main.includes('quoted separately')&&main.includes('Premium and bespoke sites are not covered by the base price'));
 assert.ok(main.includes('Currently serving Val Verde, TX.'));
 assert.ok(main.includes('<a class="button" href="tel:+18336339838"><span>Call Digifender</span>')&&main.includes('(833) 633-9838'));
 assert.deepEqual([...new Set(html.match(/href="tel:[^"]*"/g))],['href="tel:+18336339838"']);
 assert.ok(home.includes('<a href="/managed-hosting">Managed hosting</a>'),'homepage nav link');
 assert.ok(html.includes('href="/managed-hosting" aria-current="page"'),'subpage nav link');
 // Page content (excluding the shared site header/footer): no currency, amounts, forbidden words or vendor names.
 const text=main.replace(/<[^>]+>/g,' ');
 assert.doesNotMatch(text,/[$€£¥]|\d\s?(?:USD|EUR|GBP|dollars?)\b|\bdollars?\b|\bUS\$|\d+\s?%/i);
 assert.doesNotMatch(text,/uptime|\bSLA\b|guarantee|certified|SOC ?2|testimonial|ADA[ -]compliant|lawsuit-proof/i);
 assert.doesNotMatch(text,/\b(?:Square|Toast|ChowNow|Wix|Thryv|Hibu|NiceJob|Birdeye|Podium|Mailchimp|Twilio|Google|Yelp|Facebook|Nextdoor|Apple|Bing|Shopify|Stripe|PayPal|Presence|Growth|Pro)\b/);
 assert.doesNotMatch(html,/Pricing Sheet/i);
}
console.log('managed hosting page ok');
