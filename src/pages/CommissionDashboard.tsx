import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign, TrendingUp, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import PayhipSetupGuide from "@/components/PayhipSetupGuide";

interface CommissionData {
  total_commission: number;
  total_sales: number;
  projects_count: number;
  pending_payout: number;
}

interface ProjectCommission {
  video_title: string;
  total_sales: number;
  commission_earned: number;
  sale_count: number;
}

export default function CommissionDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [commissionData, setCommissionData] = useState<CommissionData | null>(null);
  const [projectCommissions, setProjectCommissions] = useState<ProjectCommission[]>([]);
  const [payoutHistory, setPayoutHistory] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    // Subscribe to realtime updates for new commission splits
    const channel = supabase
      .channel('commission-splits-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'commission_splits',
          filter: `contributor_id=eq.${currentUserId}`,
        },
        (payload) => {
          console.log('New commission received:', payload);
          toast({
            title: "New Commission!",
            description: "You've earned a new commission from a sale.",
          });
          // Reload data to reflect new commission
          loadCommissionData(currentUserId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  const checkAuthAndLoadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setCurrentUserId(user.id);
    await loadCommissionData(user.id);
  };

  const loadCommissionData = async (userId: string) => {
    try {
      // Get commission splits
      const { data: splits, error: splitsError } = await supabase
        .from('commission_splits')
        .select(`
          *,
          videos (title),
          payhip_sales (sale_amount, product_name, sale_date)
        `)
        .eq('contributor_id', userId)
        .order('calculated_at', { ascending: false });

      if (splitsError) throw splitsError;

      // Calculate totals
      const totalCommission = splits?.reduce((sum, split) => sum + parseFloat(split.commission_amount.toString()), 0) || 0;
      const totalSales = splits?.reduce((sum, split) => sum + parseFloat(split.payhip_sales.sale_amount.toString()), 0) || 0;
      
      // Group by project (video title or product name from direct sales)
      const projectMap = new Map<string, ProjectCommission>();
      splits?.forEach((split: any) => {
        // Use video title if available, otherwise use product name from Payhip sale
        const projectName = split.videos?.title || split.payhip_sales?.product_name || 'Direct Affiliate Sale';
        
        if (!projectMap.has(projectName)) {
          projectMap.set(projectName, {
            video_title: projectName,
            total_sales: 0,
            commission_earned: 0,
            sale_count: 0,
          });
        }
        const project = projectMap.get(projectName)!;
        project.total_sales += parseFloat(split.payhip_sales.sale_amount.toString());
        project.commission_earned += parseFloat(split.commission_amount.toString());
        project.sale_count += 1;
      });

      setProjectCommissions(Array.from(projectMap.values()));

      // Get payout history
      const { data: payouts, error: payoutsError } = await supabase
        .from('payout_records')
        .select('*')
        .eq('contributor_id', userId)
        .order('payout_date', { ascending: false });

      if (payoutsError) throw payoutsError;

      const completedPayouts = payouts?.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0) || 0;
      const pendingPayout = totalCommission - completedPayouts;

      setCommissionData({
        total_commission: totalCommission,
        total_sales: totalSales,
        projects_count: projectMap.size,
        pending_payout: pendingPayout,
      });

      setPayoutHistory(payouts || []);
    } catch (error) {
      console.error('Error loading commission data:', error);
      toast({
        title: "Error",
        description: "Failed to load commission data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading commission data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <h1 className="text-4xl font-bold mb-8 text-foreground">Commission Dashboard</h1>

        {/* Setup Guide */}
        <PayhipSetupGuide />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${commissionData?.total_commission.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${commissionData?.pending_payout.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Awaiting payout</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${commissionData?.total_sales.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From your projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{commissionData?.projects_count}</div>
              <p className="text-xs text-muted-foreground">Contributing to</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Commission by Project</CardTitle>
              <CardDescription>Your earnings breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectCommissions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="video_title" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="commission_earned" fill="hsl(var(--primary))" name="Commission ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Distribution</CardTitle>
              <CardDescription>Sales by project</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectCommissions}
                    dataKey="total_sales"
                    nameKey="video_title"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {projectCommissions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Project Details Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Detailed breakdown of your contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Project</th>
                    <th className="text-right p-2">Sales Count</th>
                    <th className="text-right p-2">Total Sales</th>
                    <th className="text-right p-2">Your Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {projectCommissions.map((project, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{project.video_title}</td>
                      <td className="text-right p-2">{project.sale_count}</td>
                      <td className="text-right p-2">${project.total_sales.toFixed(2)}</td>
                      <td className="text-right p-2 font-bold">${project.commission_earned.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Payout History */}
        <Card>
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
            <CardDescription>Record of completed and pending payouts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Date</th>
                    <th className="text-right p-2">Amount</th>
                    <th className="text-center p-2">Status</th>
                    <th className="text-left p-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutHistory.map((payout) => (
                    <tr key={payout.id} className="border-b">
                      <td className="p-2">{new Date(payout.payout_date).toLocaleDateString()}</td>
                      <td className="text-right p-2">${parseFloat(payout.amount).toFixed(2)}</td>
                      <td className="text-center p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          payout.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payout.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payout.status}
                        </span>
                      </td>
                      <td className="p-2 text-sm text-muted-foreground">{payout.notes || '-'}</td>
                    </tr>
                  ))}
                  {payoutHistory.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center p-4 text-muted-foreground">
                        No payout records yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}