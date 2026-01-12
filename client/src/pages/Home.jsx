import HeroSection from "../components/sections/HeroSection.jsx";
import AboutSection from "../components/sections/AboutSection.jsx";
import FeaturesSection from "../components/sections/FeaturesSection.jsx";
import CTASection from "../components/sections/CTASection.jsx";
import PageMeta from "../components/PageMeta.jsx";

export default function Home() {
  return (
    <>
      <PageMeta
        title="PricePulseAI - AI-Powered Price Tracking and Deal Alerts"
        description="Stay ahead of the market with PricePulseAI. Track prices, get instant deal alerts, and make smarter purchasing decisions using cutting-edge AI technology."
      />
      <div style={{ overflowX: "hidden" }}>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <CTASection />
      </div>
    </>
  );
}
