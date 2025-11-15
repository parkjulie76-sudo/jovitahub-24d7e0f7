import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./i18n/config";
import Chatbot from "@/components/Chatbot";
import Index from "./pages/Index";
import JoinCreator from "./pages/JoinCreator";
import AboutUs from "./pages/AboutUs";
import Charity from "./pages/Charity";
import Mission from "./pages/Mission";
import ScriptWriters from "./pages/ScriptWriters";
import VideoCreators from "./pages/VideoCreators";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactUs from "./pages/ContactUs";
import HelpCenter from "./pages/HelpCenter";
import Careers from "./pages/Careers";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import SubmitScript from "./pages/SubmitScript";
import SubmitVideo from "./pages/SubmitVideo";
import AdminSetup from "./pages/AdminSetup";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import ApplyJob from "./pages/ApplyJob";
import NewsletterAdmin from "./pages/NewsletterAdmin";
import ScriptWriterGuide from "./pages/ScriptWriterGuide";
import VideoCreatorGuide from "./pages/VideoCreatorGuide";
import CommissionDashboard from "./pages/CommissionDashboard";
import AdminCommissions from "./pages/AdminCommissions";
import HowItWorksPage from "./pages/HowItWorksPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/join-creator" element={<JoinCreator />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/charity" element={<Charity />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/script-writers" element={<ScriptWriters />} />
          <Route path="/video-creators" element={<VideoCreators />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/submit-script" element={<SubmitScript />} />
          <Route path="/submit-video" element={<SubmitVideo />} />
          <Route path="/admin-setup" element={<AdminSetup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/apply" element={<ApplyJob />} />
          <Route path="/admin/newsletter" element={<NewsletterAdmin />} />
          <Route path="/script-writer-guide" element={<ScriptWriterGuide />} />
          <Route path="/video-creator-guide" element={<VideoCreatorGuide />} />
          <Route path="/commissions" element={<CommissionDashboard />} />
          <Route path="/admin/commissions" element={<AdminCommissions />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
          <Chatbot />
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
