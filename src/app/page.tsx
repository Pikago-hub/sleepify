import { Benefits } from "@/components/sections/benefits";
import { BentoGrid } from "@/components/sections/bento";
import { CTA } from "@/components/sections/cta";
import { FAQ } from "@/components/sections/faq";
import { FeatureHighlight } from "@/components/sections/feature-highlight";
import { Features } from "@/components/sections/features";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Pricing } from "@/components/sections/pricing";
import { Testimonials } from "@/components/sections/testimonials";

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <div className="section-light bg-background">
        <FeatureHighlight />
      </div>
      <BentoGrid />
      <div className="section-light bg-background">
        <Benefits />
      </div>
      <Features />
      <div className="section-light bg-background">
        <Testimonials />
      </div>
      <Pricing />
      <div className="section-light bg-background">
        <FAQ />
      </div>
      <CTA />
      <Footer />
    </main>
  );
}
