import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Script Writer",
    content: "This platform changed my career. I can finally focus on writing meaningful content while earning a sustainable income. The collaboration tools are incredible.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Video Editor",
    content: "Finding quality scripts used to be a nightmare. Now I have access to amazing writers and get paid fairly for my editing work. Plus, knowing my work helps charitable causes feels amazing.",
    rating: 5,
  },
  {
    name: "Aisha Patel",
    role: "Content Creator",
    content: "The community here is supportive and professional. I've learned so much from other creators, and the impact we're making together keeps me motivated every day.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by Creators
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what our community members have to say about their experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="p-8 hover:shadow-2xl transition-all duration-300 bg-card border-border"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
