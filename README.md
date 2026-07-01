# AC Aesthetic Group — landing page

A concept landing page designed for **AC Aesthetic Group**, a medical spa in Alhambra, CA.
Apple-inspired structure and motion in a warm luxury palette that matches the brand's real
signature (24k gold facials, blush lip artistry, soft-lit interior).

Built as a static site so it hosts anywhere (GitHub Pages, Netlify, any folder) and loads fast.

## Stack

- Plain **HTML / CSS / JS** — no build step.
- **[Lenis](https://github.com/darkroomengineering/lenis)** for smooth scroll (CDN).
- **[Motion One](https://motion.dev) v12** for the cohesive scroll-driven animation system:
  hero parallax + fade, staggered reveals, a pinned/scrubbed "Gold Skin Renewal" scene,
  count-up stats, marquee, and hover/press micro-interactions. One easing language throughout.
- Type: **Fraunces** (display serif) + **Inter** (UI), via Google Fonts.
- Fully responsive, respects `prefers-reduced-motion`, and degrades gracefully if the
  Motion CDN is blocked (a failsafe reveals all content).

## Run locally

```bash
cd ac-aesthetic-group
python3 -m http.server 8791
# open http://localhost:8791
```

## Images (drop-in)

The site references `assets/*.jpg`. Until those files exist, each media slot shows an
intentional gradient in the brand palette, so the page looks finished. To use the real
Yelp photos, save them into `assets/` with these exact names:

| Filename          | Use on page                        | Suggested photo                                     |
| ----------------- | ---------------------------------- | --------------------------------------------------- |
| `hero.jpg`        | Full-screen hero background        | Facial-massage / treatment shot (calm, eyes closed) |
| `gold.jpg`        | Gold Skin Renewal card + gallery   | Gold collagen mask (the grid or a single mask)      |
| `gold-wide.jpg`   | Pinned "Gold Skin Renewal" scene   | Single gold-mask treatment, wide/cinematic          |
| `hydrafacial.jpg` | HydraFacial card + gallery         | Ultrasonic skin-scrubber facial                     |
| `injectables.jpg` | Botox / Dysport / Filler card      | Reception Dysport banner, or a clean clinical shot  |
| `ultherapy.jpg`   | Ultherapy card                     | Reception "Be Your Best Self" Ultherapy banner      |
| `lips.jpg`        | Lip & Brow Artistry card + gallery | Glossy lip-blush close-up                           |
| `body.jpg`        | Body Contouring & IV card          | Body/IV or wellness shot (or reuse a treatment)     |
| `interior.jpg`    | Experience section                 | Soft-lit hallway with the pink curtain              |
| `facial.jpg`      | Gallery — "The treatment room"     | Facial treatment (hands on brow)                    |

Landscape images: ~1600×1000 or larger. Portrait (`interior.jpg`): ~1200×1500.
All are shown with `object-fit: cover`, so exact crops are handled automatically.

## Before sending / going live

- [ ] Drop real photos into `assets/` (see table above).
- [ ] Replace the placeholder phone number — search `TODO(Colin)` in `index.html`
      (currently `tel:+16260000000`).
- [ ] Confirm the street address; `1234 S Garfield Ave` came straight from the Yelp
      listing and may be a listing placeholder.
- [ ] (Hardening) Pin Subresource Integrity on the Lenis `<script>` tag
      (`integrity="sha384-…" crossorigin="anonymous"`) once the CDN version is locked.
- [ ] Add a real booking link / form if they use one (Vagaro, Square, etc.).

## Notes

This is a concept preview, not an affiliated or official AC Aesthetic Group site. Copy is
grounded in their real Yelp services and 5.0 reviews; no prices or claims were invented.

---

Built with D1 Vibe Coding
