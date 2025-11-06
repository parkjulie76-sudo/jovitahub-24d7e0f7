import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          
          <Card className="p-8 mb-8">
            <div className="space-y-6">
              <div>
                <p className="text-muted-foreground mb-4">
                  <strong>Effective Date:</strong> January 2025
                </p>
                <p className="text-muted-foreground">
                  Jovita Hub ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website ebook.jovita.site and use our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                <div className="space-y-3 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
                    <p>When you register as a creator or user, we may collect:</p>
                    <ul className="list-disc list-inside ml-4 mt-2">
                      <li>Name and contact information (email, phone number)</li>
                      <li>Payment information (PayPal or bank account details)</li>
                      <li>Portfolio links and work samples</li>
                      <li>Professional experience and qualifications</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Usage Data</h3>
                    <p>We automatically collect certain information when you use our platform:</p>
                    <ul className="list-disc list-inside ml-4 mt-2">
                      <li>IP address and browser type</li>
                      <li>Device information and operating system</li>
                      <li>Pages visited and time spent on pages</li>
                      <li>Referral sources and clickstream data</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Content and Communications</h3>
                    <ul className="list-disc list-inside ml-4">
                      <li>Scripts, videos, and creative content you submit</li>
                      <li>Messages and communications with our team</li>
                      <li>Feedback and survey responses</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-2">We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Process creator applications and manage accounts</li>
                  <li>Facilitate payments and track commissions</li>
                  <li>Communicate about projects, updates, and opportunities</li>
                  <li>Improve our platform and user experience</li>
                  <li>Analyze platform usage and performance metrics</li>
                  <li>Comply with legal obligations and resolve disputes</li>
                  <li>Protect against fraud and unauthorized access</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. Information Sharing and Disclosure</h2>
                <p className="text-muted-foreground mb-3">We do not sell your personal information. We may share your information with:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Service Providers:</strong> Third-party vendors who assist with payment processing, analytics, and hosting</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement industry-standard security measures to protect your information from unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Your Rights and Choices</h2>
                <p className="text-muted-foreground mb-2">You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                  <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Data Portability:</strong> Receive your data in a structured format</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  To exercise these rights, contact us at jovitaofficail593@gmail.com
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. Cookies and Tracking Technologies</h2>
                <p className="text-muted-foreground">
                  We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can control cookie preferences through your browser settings. However, disabling cookies may limit certain features of our platform.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. International Data Transfers</h2>
                <p className="text-muted-foreground">
                  Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
                <p className="text-muted-foreground">
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">9. Changes to This Privacy Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the effective date. Your continued use of our services after changes constitutes acceptance of the updated policy.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
                <div className="space-y-2 text-muted-foreground">
                  <p>If you have questions about this Privacy Policy, please contact us:</p>
                  <p><strong>Email:</strong> jovitaofficail593@gmail.com, parkjulie76@gmail.com</p>
                  <p><strong>Phone (WhatsApp):</strong> +852-61042976</p>
                  <p><strong>Address:</strong> Room JT8394, E 1st Fr, BL.4, 358-368 KeFu Road, JiaDing District, Shanghai, China. 201813</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>Last updated: January 2025</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
