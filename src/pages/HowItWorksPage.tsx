import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
