import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function PayhipSetupGuide() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/payhip-webhook`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Webhook URL copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="mb-8 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-primary" />
          Automatic Commission Tracking Setup
        </CardTitle>
        <CardDescription>
          Connect your Payhip account to automatically track sales and commissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">How it works:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Sales occur on Payhip using your affiliate link</li>
            <li>Payhip sends real-time notifications to our system</li>
            <li>Your commissions are automatically calculated and displayed here</li>
            <li>No manual CSV uploads or admin approval needed!</li>
          </ol>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Setup Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Log in to your Payhip account</li>
            <li>Go to Settings → Webhooks</li>
            <li>Click "Add Webhook"</li>
            <li>Select the "paid" event</li>
            <li>Paste this webhook URL:</li>
          </ol>
          
          <div className="mt-4 flex items-center gap-2">
            <code className="flex-1 bg-background p-2 rounded border text-xs break-all">
              {webhookUrl}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="shrink-0"
            >
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.open('https://help.payhip.com/article/115-webhooks', '_blank')}
            className="flex items-center gap-2"
          >
            View Payhip Webhook Guide
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <p className="text-sm font-semibold mb-1">Note:</p>
          <p className="text-sm text-muted-foreground">
            Make sure your affiliate link in your creator application matches the one you're using on Payhip. 
            The system will automatically attribute sales to you based on your affiliate ID.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
