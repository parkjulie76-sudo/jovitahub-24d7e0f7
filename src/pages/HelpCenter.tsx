import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle, FileText, DollarSign, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      icon: Users,
      title: "Getting Started",
      description: "Learn the basics of joining and working with Jovita Hub",
    },
    {
      icon: FileText,
      title: "Content Creation",
      description: "Tips for creating viral scripts and videos",
    },
    {
      icon: DollarSign,
      title: "Payments & Earnings",
      description: "Understand how you get paid and track earnings",
    },
    {
      icon: MessageCircle,
      title: "Support",
      description: "Get help when you need it",
    },
  ];

  const faqs = [
    {
      category: "Getting Started",
      question: "How do I apply to become a creator?",
      answer: "Visit our 'Join as Creator' page and fill out the application form. You'll need to provide information about your experience, portfolio samples, and why you want to join. Our team reviews applications within 3-5 business days.",
    },
    {
      category: "Getting Started",
      question: "What are the requirements to join?",
      answer: "We welcome creators of all experience levels! Script writers should have a passion for storytelling and understanding of viral content. Video creators should be proficient in editing software and able to create engaging short-form content. A portfolio or samples of your work are helpful but not required for beginners.",
    },
    {
      category: "Content Creation",
      question: "What type of content do you need?",
      answer: "We focus on short-form video content (30-90 seconds) for social media platforms. Script writers create viral hooks, storytelling scripts, and product integration content. Video creators produce polished videos that incorporate our ebook content and drive sales conversions.",
    },
    {
      category: "Content Creation",
      question: "How many videos do I need to create per week?",
      answer: "We require a minimum of 3 finalized scripts or videos per week. Script writers should also provide an idea pool of at least 100 concepts weekly. Quality is important, so we focus on creating content that achieves high view counts and conversion rates.",
    },
    {
      category: "Content Creation",
      question: "What makes a successful viral video?",
      answer: "Successful videos combine strong hooks (first 3 seconds), compelling storytelling, clear ebook content integration, and a call-to-action. Videos that generate 10,000+ views with 1% conversion rate earn creator points. Those exceeding 100,000 views with 1%+ conversion earn bonus points.",
    },
    {
      category: "Payments & Earnings",
      question: "How do I get paid?",
      answer: "Creators are paid monthly via PayPal or bank transfer. Script writers and video creators with monthly scores above 50 receive a $600 base fee plus 10% sales commission. Those creating both scripts and videos earn $1,200 base plus 20% commission. Bloggers earn 15% commission only.",
    },
    {
      category: "Payments & Earnings",
      question: "What is the creator score system?",
      answer: "Creator scores determine your base pay eligibility. You earn 10-15 points per week for videos with 10,000+ views and 1%+ conversion. Videos exceeding 100,000 views with 1%+ conversion earn 50 points. Scores above 50 qualify for base monthly fees plus commissions.",
    },
    {
      category: "Payments & Earnings",
      question: "When do I receive payment?",
      answer: "Payments are processed monthly, typically within 5 business days of the month's end. You must provide valid PayPal or bank account information before payment dates. The company covers transfer fees, but you're responsible for any personal taxes.",
    },
    {
      category: "Payments & Earnings",
      question: "How are sales commissions calculated?",
      answer: "Commissions are calculated based on direct sales attributed to your content. Rates range from 10-20% depending on your creator type. Script/video creators earn 10%, combined creators earn 20%, and bloggers earn 15%. All commissions are tracked and reported monthly.",
    },
    {
      category: "Support",
      question: "Who owns the content I create?",
      answer: "You retain intellectual property rights to your scripts and creative work. However, you grant Jovita Hub an exclusive, worldwide, perpetual license for commercial use of the content. This allows us to use and distribute your work while you maintain ownership.",
    },
    {
      category: "Support",
      question: "What if I need to terminate the agreement?",
      answer: "Either party can terminate the agreement with 30 days written notice. Immediate termination is possible for fraud, non-payment, or material breach. After termination, confidentiality obligations remain in effect for 3 years.",
    },
    {
      category: "Support",
      question: "How do I contact support?",
      answer: "You can reach our support team via email at jovitaofficail593@gmail.com or parkjulie76@gmail.com, or through WhatsApp at +852-61042976. We typically respond within 24 hours during business days.",
    },
  ];

  const filteredFaqs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              Help Center
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Find answers to common questions and learn how to make the most of Jovita Hub
            </p>

            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="search"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {categories.map((category, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer bg-card/50 backdrop-blur-sm border-border">
                <category.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </Card>
            ))}
          </div>

          <Card className="p-8 mb-12 bg-card/50 backdrop-blur-sm border-border">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div>
                      <span className="text-xs text-primary font-semibold">{faq.category}</span>
                      <p className="text-base mt-1">{faq.question}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try different keywords or{" "}
                  <Link to="/contact" className="text-primary hover:underline">
                    contact our support team
                  </Link>
                </p>
              </div>
            )}
          </Card>

          <Card className="p-8 text-center bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Link to="/contact">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2">
                Contact Support
              </button>
            </Link>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpCenter;
