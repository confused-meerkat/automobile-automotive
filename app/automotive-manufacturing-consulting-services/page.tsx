import type { Metadata } from "next";
import AutomotiveLanding from "@/components/automotive-landing/AutomotiveLanding";
import { config, faq, seo } from "@/components/automotive-landing/content";

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: config.pagePath },
  openGraph: {
    type: "website",
    url: config.pagePath,
    siteName: "Gemba Concepts",
    title: seo.title,
    description: seo.description,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  robots: { index: true, follow: true },
};

// FAQ structured data, so the questions can show in search results.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <AutomotiveLanding />
    </>
  );
}
