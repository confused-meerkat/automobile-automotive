# Automotive landing page (Next.js)

The automotive manufacturing consulting landing page for gembaconcepts.com. It follows the design of `/warehouse-management` and uses the final campaign copy.

- Route: `/automotive-manufacturing-consulting-services` (the Plant Opportunity Assessment's booking button already links to `#book` on this page)
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
| `app/automotive-manufacturing-consulting-services/page.tsx` | SEO title, description, canonical and FAQ schema |
| `app/api/leads/route.ts` | Lead endpoint stub. Connect it to the CRM. |
| `app/fonts/` | Self-hosted Poppins and Geist Mono (SIL Open Font License) |

## Before go-live

1. `content.ts` → `config.assessmentUrl`: set the live URL of the Plant Opportunity Assessment.
2. `app/api/leads/route.ts`: send the lead to the CRM (the payload includes `tracking` with utm_source, utm_campaign, gclid, li_fat_id and fbclid).
3. Client logos load from the same media store as the live site (`gembaconceptswebsite.blob.core.windows.net`). `next.config.ts` already allows that host. Swiss Parenterals has no logo file yet, so its name shows instead.

## Moving it into the main site

- Copy `components/automotive-landing/` and `app/automotive-manufacturing-consulting-services/`.
- Copy `app/api/leads/` too, or point `config.leadEndpoint` at the site's existing form endpoint.
- `/images/logo-v1-full.png` already exists on the site.
- Add the two `images.remotePatterns` from `next.config.ts`.
- The page reads two font variables, `--font-poppins` and `--font-geist-mono`. If the site's root layout already loads these fonts, expose them under those names. If not, copy the `localFont` setup from `app/layout.tsx`.
- Light/dark: the page is dark by default and has its own toggle (`ThemeShell.tsx`). If the site has a site-wide theme provider, drive the page's `data-theme` from it instead.

## Responsive behaviour

The site grid has 4 columns on phones, 8 on tablets and 12 on desktops. Breakpoints are 480, 768, 960 and 1200px.

- **Phones:** the header button reads "Free Consultation" and main buttons go full width. The assessment preview turns into horizontal bars, and the logo strip and testimonial cards shrink to fit.
- **Tablets:** cards and results sit two per row. Hero, assessment and final CTA go side by side from 960px.
- **Forms:** the form switches to two columns of fields based on its own width, using a container query, so it never squeezes.

Tested in a production build at 320, 360, 390, 768, 1024 and 1440px. At every width there is no sideways scroll, no clipped text and no console errors. The form flow, the API route, the slider, the theme toggle and the logo fallback were also checked.
