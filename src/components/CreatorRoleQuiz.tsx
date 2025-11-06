import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, RotateCcw, Sparkles } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    fullStackScore: number;
    editorScore: number;
  }[];
}

const questions: Question[] = [
  {
    id: "skills",
    question: "Which best describes your primary skill set?",
    options: [
      { value: "writing", label: "Storytelling and creative writing", fullStackScore: 3, editorScore: 0 },
      { value: "editing", label: "Video editing and post-production", fullStackScore: 0, editorScore: 3 },
      { value: "both", label: "Both writing and editing equally", fullStackScore: 2, editorScore: 2 },
      { value: "learning", label: "Still developing both skills", fullStackScore: 1, editorScore: 1 },
    ],
  },
  {
    id: "preference",
    question: "What type of work do you enjoy most?",
    options: [
      { value: "creative", label: "Creating stories and scripts from scratch", fullStackScore: 3, editorScore: 0 },
      { value: "technical", label: "Polishing and perfecting visual content", fullStackScore: 0, editorScore: 3 },
      { value: "complete", label: "Seeing a project through from start to finish", fullStackScore: 2, editorScore: 1 },
      { value: "flexible", label: "I'm flexible with different types of work", fullStackScore: 1, editorScore: 1 },
    ],
  },
  {
    id: "time",
    question: "How much time can you commit weekly?",
    options: [
      { value: "full", label: "20+ hours - I want maximum earning potential", fullStackScore: 3, editorScore: 1 },
      { value: "part", label: "10-20 hours - Looking for steady side income", fullStackScore: 2, editorScore: 2 },
      { value: "limited", label: "5-10 hours - Prefer focused, efficient work", fullStackScore: 1, editorScore: 3 },
      { value: "minimal", label: "Under 5 hours - Very limited availability", fullStackScore: 0, editorScore: 2 },
    ],
  },
  {
    id: "experience",
    question: "What's your experience level?",
    options: [
      { value: "expert", label: "Expert in both writing and video production", fullStackScore: 3, editorScore: 2 },
      { value: "writer", label: "Experienced writer, learning video editing", fullStackScore: 2, editorScore: 1 },
      { value: "editor", label: "Professional editor, not a strong writer", fullStackScore: 1, editorScore: 3 },
      { value: "beginner", label: "Beginner in content creation", fullStackScore: 1, editorScore: 1 },
    ],
  },
  {
    id: "income",
    question: "What are your income expectations?",
    options: [
      { value: "maximum", label: "$5,000+ per month - Maximum earnings", fullStackScore: 3, editorScore: 1 },
      { value: "substantial", label: "$2,000-$5,000 - Substantial income", fullStackScore: 2, editorScore: 2 },
      { value: "moderate", label: "$1,000-$2,000 - Moderate side income", fullStackScore: 1, editorScore: 2 },
      { value: "starting", label: "$500-$1,000 - Just getting started", fullStackScore: 1, editorScore: 2 },
    ],
  },
];

export const CreatorRoleQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
  };

  const calculateResult = () => {
    let fullStackScore = 0;
    let editorScore = 0;

    questions.forEach((question) => {
      const answer = answers[question.id];
      if (answer) {
        const option = question.options.find((opt) => opt.value === answer);
        if (option) {
          fullStackScore += option.fullStackScore;
          editorScore += option.editorScore;
        }
      }
    });

    const totalScore = fullStackScore + editorScore;
    const fullStackPercentage = totalScore > 0 ? (fullStackScore / totalScore) * 100 : 50;

    if (fullStackPercentage >= 60) {
      return {
        role: "Full-Stack Video Creator",
        description: "You're a perfect fit for creating complete videos from script to final edit!",
        benefits: [
          "Higher monthly fee ($1,200)",
          "Better commission rate (20%)",
          "Maximum earning potential ($2,000-$100,000/month)",
          "Complete creative control over projects",
        ],
        color: "primary",
      };
    } else if (fullStackPercentage <= 40) {
      return {
        role: "Video Editor Only",
        description: "Your expertise in video editing makes you ideal for this focused role!",
        benefits: [
          "Monthly fee of $600",
          "10% commission rate",
          "Strong income potential ($1,000-$50,000/month)",
          "Focus on your editing strengths",
        ],
        color: "secondary",
      };
    } else {
      return {
        role: "Either Role Could Work",
        description: "You have balanced skills! Consider your time availability and income goals.",
        benefits: [
          "Try Full-Stack if you want maximum earnings",
          "Choose Video Editor if you prefer focused work",
          "Both roles offer great opportunities",
          "You can always start with one and transition later",
        ],
        color: "accent",
      };
    }
  };

  const currentQ = questions[currentQuestion];
  const currentAnswer = answers[currentQ?.id];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResult) {
    const result = calculateResult();
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-3xl mb-2">Your Recommended Role</CardTitle>
          <CardDescription>Based on your answers, here's what we recommend</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
            <Badge className={`mb-4 text-lg py-2 px-4 bg-${result.color}`}>
              {result.role}
            </Badge>
            <p className="text-lg text-muted-foreground">{result.description}</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Why This Role is Perfect For You:</h3>
            {result.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={resetQuiz} variant="outline" className="flex-1 gap-2">
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </Button>
            <Button 
              onClick={() => {
                const element = document.getElementById(
                  result.role.includes("Full-Stack") ? "fullstack-section" : 
                  result.role.includes("Editor") ? "editor-section" : "comparison-table"
                );
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex-1 gap-2"
            >
              View Details
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-secondary/20 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <CardTitle className="text-2xl">{currentQ.question}</CardTitle>
        <CardDescription>Select the option that best describes you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={currentAnswer} onValueChange={(value) => handleAnswer(currentQ.id, value)}>
          <div className="space-y-3">
            {currentQ.options.map((option) => (
              <div
                key={option.value}
                className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                  currentAnswer === option.value ? "border-primary bg-primary/5" : "border-border"
                }`}
                onClick={() => handleAnswer(currentQ.id, option.value)}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        <div className="flex gap-3 pt-4">
          {currentQuestion > 0 && (
            <Button onClick={handleBack} variant="outline" className="flex-1">
              Back
            </Button>
          )}
          <Button 
            onClick={handleNext} 
            disabled={!currentAnswer}
            className="flex-1 gap-2"
          >
            {currentQuestion === questions.length - 1 ? "See Results" : "Next"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
