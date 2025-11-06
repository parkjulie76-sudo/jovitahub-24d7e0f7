import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const RoleComparison = () => {
  const roles = [
    {
      title: "Script Writers",
      path: "/script-writers",
      monthlyFee: "$600",
      commission: "10%",
      incomeRange: "$1,000 - $50,000",
      weeklyOutput: "5+ scripts per week",
      responsibilities: [
        { text: "Write viral storytelling scripts", included: true },
        { text: "Research eBook themes", included: true },
        { text: "Video editing", included: false },
        { text: "Video production", included: false },
      ],
      timeCommitment: "10-15 hours/week",
      skillLevel: "Writing & storytelling",
      color: "from-primary/10 to-primary/5",
      borderColor: "border-primary/20",
    },
    {
      title: "Video Creators",
      path: "/video-creators",
      monthlyFee: "$1,200",
      commission: "20%",
      incomeRange: "$2,000 - $100,000",
      weeklyOutput: "5+ complete videos per week",
      responsibilities: [
        { text: "Write viral storytelling scripts", included: true },
        { text: "Research eBook themes", included: true },
        { text: "Video editing", included: true },
        { text: "Complete video production", included: true },
      ],
      timeCommitment: "25-35 hours/week",
      skillLevel: "Writing + editing + production",
      color: "from-accent/10 to-accent/5",
      borderColor: "border-accent/20",
      featured: true,
    },
    {
      title: "Video Editors",
      path: "/video-editors",
      monthlyFee: "$600",
      commission: "10%",
      incomeRange: "$1,000 - $50,000",
      weeklyOutput: "5+ edited videos per week",
      responsibilities: [
        { text: "Write viral storytelling scripts", included: false },
        { text: "Research eBook themes", included: false },
        { text: "Video editing", included: true },
        { text: "Video production", included: true },
      ],
      timeCommitment: "15-20 hours/week",
      skillLevel: "Video editing & production",
      color: "from-secondary/10 to-secondary/5",
      borderColor: "border-secondary/20",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Creator Path
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compare roles to find the perfect fit for your skills and goals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {roles.map((role, index) => (
            <Card
              key={index}
              className={`relative p-6 bg-gradient-to-br ${role.color} ${role.borderColor} border-2 hover:shadow-2xl transition-all duration-300 ${
                role.featured ? "md:-translate-y-4 md:scale-105" : ""
              }`}
            >
              {role.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Highest Earning Potential
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{role.title}</h3>
                <div className="space-y-1">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-3xl font-bold text-primary">{role.monthlyFee}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <div className="text-lg font-semibold text-accent">
                    + {role.commission} commission
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Income: <span className="font-semibold">{role.incomeRange}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-6 mb-6">
                {/* Weekly Output */}
                <div>
                  <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase">
                    Weekly Output
                  </h4>
                  <p className="text-sm font-medium">{role.weeklyOutput}</p>
                </div>

                {/* Time Commitment */}
                <div>
                  <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase">
                    Time Commitment
                  </h4>
                  <p className="text-sm font-medium">{role.timeCommitment}</p>
                </div>

                {/* Skills Required */}
                <div>
                  <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase">
                    Skills Required
                  </h4>
                  <p className="text-sm font-medium">{role.skillLevel}</p>
                </div>

                {/* Responsibilities */}
                <div>
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">
                    Responsibilities
                  </h4>
                  <div className="space-y-2">
                    {role.responsibilities.map((resp, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        {resp.included ? (
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-muted-foreground/40 mt-0.5 flex-shrink-0" />
                        )}
                        <span
                          className={`text-sm ${
                            resp.included ? "text-foreground" : "text-muted-foreground/60"
                          }`}
                        >
                          {resp.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Link to={role.path} className="block">
                <Button
                  variant={role.featured ? "default" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  Learn More
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-2">All Roles Include:</h4>
                <ul className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <li>• Remote work flexibility</li>
                  <li>• Weekly commission payments</li>
                  <li>• Performance-based bonuses</li>
                  <li>• Access to viral content strategies</li>
                  <li>• Unique sales tracking link</li>
                  <li>• Peer-to-peer charity reimbursement</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RoleComparison;
