import type { Metadata } from "next";
import styles from "@/components/automotive-landing/landing.module.css";
import ThemeShell from "@/components/automotive-landing/ThemeShell";
import SiteHeader from "@/components/automotive-landing/SiteHeader";
import SiteFooter from "@/components/automotive-landing/SiteFooter";
import SopReadinessCheck from "@/components/automotive-landing/sop-check/SopReadinessCheck";
import { config, sopCheck } from "@/components/automotive-landing/content";

export const metadata: Metadata = {
  title: sopCheck.seoTitle,
  description: sopCheck.seoDescription,
  alternates: { canonical: config.toolPath },
  openGraph: {
    type: "website",
    url: config.toolPath,
    siteName: "Gemba Concepts",
    title: sopCheck.seoTitle,
    description: sopCheck.seoDescription,
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
};

// Gated: the tool opens only once contact details are on file (see SopReadinessCheck / SopGate).
export default function Page() {
  return (
    <ThemeShell>
      <SiteHeader homeHref={config.pagePath} ctaHref={`${config.pagePath}#book`} />
      <main id="top" className={styles.wrap}>
        <SopReadinessCheck />
      </main>
      <SiteFooter />
    </ThemeShell>
  );
}
