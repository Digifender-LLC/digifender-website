# Digifender print designs

Marks are copied unchanged from `../digifender-brand-family/` (horizontal lockups and symbols). No geometry was redrawn. Palette: Midnight #09172B, Ink #10233F, Cobalt #245FE5, Cyan #12B7D5, Paper #F4F7FB, White #FFFFFF. 1 SVG user unit = 0.01 in. Each SVG has a PNG preview rendered with rsvg-convert (sRGB).

Layers (named so a printer can find them): `Bleed` (background to the bleed edge), `Artwork` (marks, rules), `Text` (outlined Manrope), `Safe` and `Trim` (hidden magenta guides, do not print).

| File | Real size | Bleed / safe | Colours | Mark variant | PNG |
|---|---|---|---|---|---|
| business-card-front.svg | 3.5 x 2 in trim; artboard 3.75 x 2.25 in | 0.125 in bleed; 0.125 in safe | Paper background | Signature horizontal lockup, symbol 0.60 in (15.2 mm) | 1125 x 675 px, 300 dpi (symbol 180 px) |
| business-card-back.svg | same | same | Midnight background; Paper and Cyan text | Glacier symbol, 0.60 in (15.2 mm) | 1125 x 675 px, 300 dpi |
| letterhead.svg | US Letter 8.5 x 11 in | no bleed; 0.75 in margins | white paper, Ink text, Cobalt 0.75 pt footer rule | Signature horizontal lockup, 0.55 in (14.0 mm) | 1275 x 1650 px, 150 dpi (symbol 83 px) |
| envelope-no10.svg | 9.5 x 4.125 in | no bleed; 0.5 in margin | white paper, Ink text | Signature horizontal lockup, 0.50 in (12.7 mm) | 2850 x 1238 px, 300 dpi |

Clear space: every mark has at least 20% of symbol height around it, inside the artboard and clear of text (checked by script). The horizontal lockup canvas already includes it.

Text (new, outlined from `fonts/Manrope-Variable.ttf`, weights 400 to 700, converted to paths so no font is needed): card back contact block, letterhead footer, envelope return address. Footer and card text is 6.5 to 8 pt.

Print notes: business card back is a full-bleed Midnight flood; ask the printer about ink coverage and cutting tolerance. Letterhead leaves the whole area between the mark and the footer rule open for writing. Envelope art is the return address only; keep the recipient and postage areas empty and follow the printer or postal layout rules.

## PLACEHOLDERS
- `[PLACEHOLDER: name]` and `[PLACEHOLDER: title]` on the card back (visible text in the SVG; replace per person).
- Tagline: none exists, none used.
- Owner approval still needed on: layouts, the Midnight card back, letterhead footer wording and order, and use of the mailing address as the return address.

## Proof before production
- PNGs are sRGB previews only.
- CMYK conversion (Signature and Glacier gradients and Midnight shift most) must be proofed by the printer on the final stock.
- Confirm trim, bleed and safe values and the finished size against the printer's template before ordering.
