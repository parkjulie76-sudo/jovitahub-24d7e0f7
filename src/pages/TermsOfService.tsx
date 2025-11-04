import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Content Creator Agreement
          </h1>
          
          <Card className="p-8 mb-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Company Information</h2>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Company:</strong> ebook.jovita.site (Jovita Hub)</p>
                  <p><strong>Legal Company Name:</strong> Shanghai WeiHao Film Co., Ltd 上海韦豪影视科技有限公司</p>
                  <p><strong>Registration ID:</strong> 91310114MA1GXNTP57</p>
                  <p><strong>Registered Address:</strong> Room JT8394, E 1st Fr, BL.4, 358-368 KeFu Road, JiaDing District, Shanghai, China. 201813</p>
                  <p><strong>Official Email:</strong> jovitaofficail593@gmail.com, parkjulie76@gmail.com</p>
                  <p><strong>Phone (WhatsApp):</strong> +852-61042976</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">1. Purpose</h2>
                <p className="text-muted-foreground">
                  The Creator and the Company hereby agree, in accordance with the terms of this Agreement, to cooperate in the marketing of the digital project titled "eBook – The 7 Laws Mastered by Wealthy People."
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. Work Requirements</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Creator provides an idea pool of at least 100 short video format or script ideas per week.</li>
                  <li>Produce a minimum of 3 finalized short video scripts or short videos per week.</li>
                  <li>Scripts must follow Company's structure: Title, Hook, the ebook content, and storytelling. Videos shall include ebook content.</li>
                  <li>Submit via official email for approval.</li>
                  <li>Videos may be produced by the Creator or can collaborate with other video creators.</li>
                  <li>All work performed remotely.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. Compensation</h2>
                <p className="text-muted-foreground mb-4">
                  The Creator's compensation shall be implemented in accordance with the compensation schedule below. The basic fee applies to creators with a monthly score above 50. Commissions are calculated per sale. Creators with a score below 50 will receive commission only.
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-3 text-left">Creator Type</th>
                        <th className="border border-border p-3 text-left">Basic Fee/Monthly (USD)</th>
                        <th className="border border-border p-3 text-left">Sales Commission % (USD)</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr>
                        <td className="border border-border p-3">Blogger</td>
                        <td className="border border-border p-3">0</td>
                        <td className="border border-border p-3">15%</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">Script/Format Creator</td>
                        <td className="border border-border p-3">600</td>
                        <td className="border border-border p-3">10%</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">Video Creator</td>
                        <td className="border border-border p-3">600</td>
                        <td className="border border-border p-3">10%</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">(Script + Video) Creator</td>
                        <td className="border border-border p-3">1200</td>
                        <td className="border border-border p-3">20%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-3">Creator Score Calculation</h3>
                  <p className="text-muted-foreground mb-2"><strong>Each video with views over 10,000 and sales conversion over 1%:</strong></p>
                  <ul className="list-disc list-inside text-muted-foreground mb-4">
                    <li>1-3 short videos per week: 10 points</li>
                    <li>&gt;3 short videos per week: 15 points</li>
                  </ul>
                  <p className="text-muted-foreground"><strong>Each video with views over 100,000 and sales conversion over 1%:</strong></p>
                  <ul className="list-disc list-inside text-muted-foreground">
                    <li>&gt;1 short video per month: 50 points</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Payment Accounts and Methods</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Payment accounts must be under the legal name and registered email of each party.</li>
                  <li>Payment methods: PayPal or bank transfer.</li>
                  <li>Company bears transfer fees; Creator covers personal taxes.</li>
                  <li>Creator must provide valid account before payment date.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Copyright Ownership and Usage Rights</h2>
                <p className="text-muted-foreground">
                  All scripts remain creator's intellectual property. Creator grants Company an exclusive, worldwide, perpetual license for commercial use. Creator warrants originality and indemnifies Company from infringement claims. The copyright and ownership of the digital products belong to the Company, and any act of copyright infringement shall be deemed an unlawful act. The Company reserves the right to pursue legal liability and claim damages for any such violation.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. Confidentiality</h2>
                <p className="text-muted-foreground">
                  Each party shall keep strictly confidential all information, content, agreements, and strategies, and shall not disclose such information to any third party for a period of three (3) years following the termination of this agreement.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. Termination</h2>
                <p className="text-muted-foreground">
                  Either party may terminate with 30 days' notice. Immediate termination for fraud, non-payment, or material breach.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Governing Law and Dispute Resolution</h2>
                <p className="text-muted-foreground">
                  This Agreement is governed by the laws of the Creator's country. Disputes resolved through arbitration or competent court in a mutually agreed third-party jurisdiction (excluding both parties' countries). Arbitration in English; award final and binding.
                </p>
              </div>

              <div className="pt-6 border-t border-border">
                <h2 className="text-2xl font-bold mb-4">9. Signatures</h2>
                <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
                  <div>
                    <p className="font-semibold mb-2">For Company (Jovita Hub – ebook.jovita.site)</p>
                    <p><strong>Name:</strong> FUJI PIAO (Julie Park)</p>
                    <p><strong>Title:</strong> Founder</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">For Contractor (Creator)</p>
                    <p><strong>Title:</strong> Independent Creator</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>Last updated: October 2025</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
