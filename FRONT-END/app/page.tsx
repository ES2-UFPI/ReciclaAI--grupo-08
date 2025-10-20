import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { AdBanner } from "@/components/ad-banner"
import { SupportersSection } from "@/components/supporters-section"
import { FaqSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <StatsSection />

      {/* <div className="container mx-auto px-4 py-12">
        <AdBanner />
      </div> */}

      <SupportersSection />

      {/* <div className="container mx-auto px-4 py-12">
        <AdBanner />
      </div> */}

      <FaqSection />
      <Footer />
    </main>
  )
}
