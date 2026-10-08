# Automotive landing page (Next.js)

The automotive manufacturing consulting landing page for gembaconcepts.com. It follows the design of `/warehouse-management` and uses the final campaign copy.

- Route: `/automotive-manufacturing-consulting-services`
- Interactive tool: `/automotive-manufacturing-consulting-services/sop-readiness-check` — the **EV Plant SOP Readiness Check**, gated behind the landing page's contact form (see below)
- Stack: Next.js 15 App Router, React 19, TypeScript, CSS Modules, `lucide-react` icons. No Tailwind dependency, so it drops into any Next.js app.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000 redirects to the landing page
npm run build && npm start
```

## Where things are

| Path | What it is |
| --- | --- |
| `components/automotive-landing/content.ts` | **All copy**, links and settings. Edit words here. |
| `components/automotive-landing/AutomotiveLanding.tsx` | Page layout, section by section |
| `components/automotive-landing/landing.module.css` | All styles and colour tokens, scoped to the page |
| `components/automotive-landing/LeadForm.tsx` | The hero and #book forms: validation, UTM capture, thank-you state |
| `components/automotive-landing/HeroGrid.tsx` | Animated grid behind the hero |
| `components/automotive-landing/TestimonialCarousel.tsx` | Client Voices slider |
| `components/automotive-landing/LogoImage.tsx` | Client logos, with the company name as a fallback |
| `components/automotive-landing/sop-check/` | The EV Plant SOP Readiness Check: `data.ts` (the 25 activities and all tool copy), `logic.ts` (scoring, saved state, gate), `SopGate.tsx` (contact gate), `SopReadinessCheck.tsx` (steps), `SopResults.tsx` (results), `sop.module.css` |
| `app/automotive-manufacturing-consulting-services/page.tsx` | SEO title, description, canonical and FAQ schema |
| `app/automotive-manufacturing-consulting-services/sop-readiness-check/page.tsx` | The tool's page and SEO tags |
| `app/api/leads/route.ts` | Lead endpoint stub. Connect it to the CRM. |
| `app/fonts/` | Self-hosted Poppins and Geist Mono (SIL Open Font License) |

## Before go-live

1. `app/api/leads/route.ts`: send the lead to the CRM (the payload includes `tracking` with utm_source, utm_campaign, gclid, li_fat_id and fbclid). It receives three kinds of post, told apart by `form`: `hero`, `book`, `tool` (the readiness-check gate), and `sop-readiness-check` (the tool's results: `profile`, `answers`, `result` with the readiness index, band, ownership gaps and stage scores, plus the same `lead` and `tracking`).

## The gated readiness check

- The `#assessment` section on the landing page shows the tool's intro and a contact gate with the same fields and validation as the other forms. Submitting it opens the tool page.
- Going to the tool page directly shows the same gate until contact details are on file. Anyone who has already sent the hero or #book form is let straight in.
- The gate is client-side (`localStorage` key `gc-sop-unlock`), which suits a marketing gate. Answers are kept in `gc-sop-check`, so a half-done check survives a reload.
- When a visitor reaches the results, the answers and scores are sent once to `/api/leads` with their contact details. If they edit answers and come back, the update is sent again.
- Scoring, wording and the responsibility map match the original standalone `ev-plant-sop-readiness-check.html`.
3. Client logos load from the same media store as the live site (`gembaconceptswebsite.blob.core.windows.net`). `next.config.ts` already allows that host. Swiss Parenterals has no logo file yet, so its name shows instead.

## Moving it into the main site

- Copy `components/automotive-landing/` and `app/automotive-manufacturing-consulting-services/` (this includes the `sop-readiness-check/` route).
- Copy `app/api/leads/` too, or point `config.leadEndpoint` at the site's existing form endpoint.
- `/images/logo-v1-full.png` already exists on the site.
- Add the two `images.remotePatterns` from `next.config.ts`.
- The page reads two font variables, `--font-poppins` and `--font-geist-mono`. If the site's root layout already loads these fonts, expose them under those names. If not, copy the `localFont` setup from `app/layout.tsx`.
- Light/dark: the page is dark by default and has its own toggle (`ThemeShell.tsx`). If the site has a site-wide theme provider, drive the page's `data-theme` from it instead.

## Responsive behaviour

The site grid has 4 columns on phones, 8 on tablets and 12 on desktops. Breakpoints are 480, 768, 960 and 1200px.

- **Phones:** the header button reads "Free Consultation" and main buttons go full width. The logo strip and testimonial cards shrink to fit. In the readiness check, the status buttons sit two by two and the stage line shows a "Stage n of 6" caption.
- **Tablets:** cards and results sit two per row. Hero, the readiness-check gate and final CTA go side by side from 960px.
- **Forms:** the form switches to two columns of fields based on its own width, using a container query, so it never squeezes.

Tested in a production build at 320, 360, 390, 768, 1024 and 1440px. At every width there is no sideways scroll, no clipped text and no console errors. The form flow, the API route, the slider, the theme toggle and the logo fallback were also checked.
