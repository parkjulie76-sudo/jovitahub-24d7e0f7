import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import RoleComparison from "@/components/RoleComparison";
import Benefits from "@/components/Benefits";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <div className="container mx-auto px-4 pt-20">
          <EmailVerificationBanner />
        </div>
        <Hero />
        <section id="how-it-works">
          <HowItWorks />
        </section>
        <RoleComparison />
        <Stats />
        <section id="benefits">
          <Benefits />
        </section>
        <section id="testimonials">
          <Testimonials />
        </section>
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
