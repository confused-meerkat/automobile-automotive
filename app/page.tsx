import { redirect } from "next/navigation";
import { config } from "@/components/automotive-landing/content";

// Standalone project only: send the root URL to the landing page.
export default function Home() {
  redirect(config.pagePath);
}
