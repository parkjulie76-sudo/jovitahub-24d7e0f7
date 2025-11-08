import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, Plus, DollarSign, Users, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminCommissions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [contributors, setContributors] = useState<any[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string>("");
  
  // Add contributor form
  const [newContributor, setNewContributor] = useState({
    videoId: "",
    userId: "",
    payhipAffiliateId: "",
    commissionPercentage: "",
    role: "",
  });

  // Payout form
  const [payoutForm, setPayoutForm] = useState({
    contributorId: "",
    amount: "",
    payoutDate: "",
    notes: "",
  });

  const [stats, setStats] = useState({
    totalSales: 0,
    totalCommissions: 0,
    totalPaid: 0,
    activeContributors: 0,
  });

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    // Check if user is admin
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roles) {
      toast({
        title: "Access Denied",
        description: "You must be an admin to access this page",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    await loadAllData();
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Load videos
      const { data: videosData } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });
      setVideos(videosData || []);

      // Load users (profiles)
      const { data: usersData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, serial_number');
      setUsers(usersData || []);

      // Load sales
      const { data: salesData } = await supabase
        .from('payhip_sales')
        .select('*, videos(title)')
        .order('sale_date', { ascending: false });
      setSales(salesData || []);

      // Load contributors
      const { data: contributorsData } = await supabase
        .from('project_contributors')
        .select('*, videos(title), profiles(first_name, last_name)');
      setContributors(contributorsData || []);

      // Calculate stats
      const totalSales = salesData?.reduce((sum, sale) => sum + parseFloat(sale.sale_amount.toString()), 0) || 0;
      const totalCommissions = salesData?.reduce((sum, sale) => sum + parseFloat(sale.commission_amount.toString()), 0) || 0;
      
      const { data: payouts } = await supabase
        .from('payout_records')
        .select('amount')
        .eq('status', 'completed');
      const totalPaid = payouts?.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0) || 0;

      const activeContributors = new Set(contributorsData?.map(c => c.user_id)).size;

      setStats({
        totalSales,
        totalCommissions,
        totalPaid,
        activeContributors,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile || !selectedVideoId) {
      toast({
        title: "Missing Information",
        description: "Please select a video and upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const csvText = await csvFile.text();
      
      const { data, error } = await supabase.functions.invoke('process-payhip-csv', {
        body: {
          csvData: csvText,
          videoId: selectedVideoId,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Imported ${data.imported} sales out of ${data.total} records`,
      });

      setCsvFile(null);
      setSelectedVideoId("");
      await loadAllData();
    } catch (error) {
      console.error('Error uploading CSV:', error);
      toast({
        title: "Error",
        description: "Failed to process CSV file",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddContributor = async () => {
    if (!newContributor.videoId || !newContributor.userId || !newContributor.payhipAffiliateId || !newContributor.commissionPercentage || !newContributor.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('project_contributors')
        .insert({
          video_id: newContributor.videoId,
          user_id: newContributor.userId,
          payhip_affiliate_id: newContributor.payhipAffiliateId,
          commission_percentage: parseFloat(newContributor.commissionPercentage),
          role: newContributor.role,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contributor added successfully",
      });

      setNewContributor({
        videoId: "",
        userId: "",
        payhipAffiliateId: "",
        commissionPercentage: "",
        role: "",
      });

      await loadAllData();
    } catch (error) {
      console.error('Error adding contributor:', error);
      toast({
        title: "Error",
        description: "Failed to add contributor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayout = async () => {
    if (!payoutForm.contributorId || !payoutForm.amount || !payoutForm.payoutDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('payout_records')
        .insert({
          contributor_id: payoutForm.contributorId,
          amount: parseFloat(payoutForm.amount),
          payout_date: payoutForm.payoutDate,
          notes: payoutForm.notes,
          status: 'completed',
          created_by: user?.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payout recorded successfully",
      });

      setPayoutForm({
        contributorId: "",
        amount: "",
        payoutDate: "",
        notes: "",
      });

      await loadAllData();
    } catch (error) {
      console.error('Error recording payout:', error);
      toast({
        title: "Error",
        description: "Failed to record payout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

        <h1 className="text-4xl font-bold mb-8 text-foreground">Commission Management</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSales.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalCommissions.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid Out</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalPaid.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Contributors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeContributors}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="import" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="import">Import Sales</TabsTrigger>
            <TabsTrigger value="contributors">Manage Contributors</TabsTrigger>
            <TabsTrigger value="sales">View Sales</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          </TabsList>

          <TabsContent value="import">
            <Card>
              <CardHeader>
                <CardTitle>Import Payhip Sales CSV</CardTitle>
                <CardDescription>Upload CSV file with sales data to calculate commissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Video Project</Label>
                  <Select value={selectedVideoId} onValueChange={setSelectedVideoId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a video" />
                    </SelectTrigger>
                    <SelectContent>
                      {videos.map((video) => (
                        <SelectItem key={video.id} value={video.id}>
                          {video.title} ({video.serial_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Upload CSV File</Label>
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    CSV should include: sale_id, affiliate_id, sale_amount, commission_amount, sale_date, product_name, buyer_email
                  </p>
                </div>

                <Button onClick={handleCsvUpload} disabled={loading || !csvFile || !selectedVideoId}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Sales Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contributors">
            <Card>
              <CardHeader>
                <CardTitle>Project Contributors</CardTitle>
                <CardDescription>Assign contributors and set commission splits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Video Project</Label>
                      <Select value={newContributor.videoId} onValueChange={(value) => setNewContributor({...newContributor, videoId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select video" />
                        </SelectTrigger>
                        <SelectContent>
                          {videos.map((video) => (
                            <SelectItem key={video.id} value={video.id}>
                              {video.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Contributor</Label>
                      <Select value={newContributor.userId} onValueChange={(value) => setNewContributor({...newContributor, userId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.first_name} {user.last_name} ({user.serial_number})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Payhip Affiliate ID</Label>
                      <Input
                        value={newContributor.payhipAffiliateId}
                        onChange={(e) => setNewContributor({...newContributor, payhipAffiliateId: e.target.value})}
                        placeholder="affiliate123"
                      />
                    </div>

                    <div>
                      <Label>Commission %</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={newContributor.commissionPercentage}
                        onChange={(e) => setNewContributor({...newContributor, commissionPercentage: e.target.value})}
                        placeholder="10.00"
                      />
                    </div>

                    <div>
                      <Label>Role</Label>
                      <Input
                        value={newContributor.role}
                        onChange={(e) => setNewContributor({...newContributor, role: e.target.value})}
                        placeholder="Script Writer / Video Editor"
                      />
                    </div>
                  </div>

                  <Button onClick={handleAddContributor} disabled={loading}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Contributor
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Video</th>
                        <th className="text-left p-2">Contributor</th>
                        <th className="text-left p-2">Affiliate ID</th>
                        <th className="text-left p-2">Role</th>
                        <th className="text-right p-2">Commission %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contributors.map((contributor) => (
                        <tr key={contributor.id} className="border-b">
                          <td className="p-2">{contributor.videos?.title}</td>
                          <td className="p-2">{contributor.profiles?.first_name} {contributor.profiles?.last_name}</td>
                          <td className="p-2">{contributor.payhip_affiliate_id}</td>
                          <td className="p-2">{contributor.role}</td>
                          <td className="text-right p-2">{contributor.commission_percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Sales Records</CardTitle>
                <CardDescription>All imported sales data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Video</th>
                        <th className="text-left p-2">Product</th>
                        <th className="text-left p-2">Affiliate ID</th>
                        <th className="text-right p-2">Sale Amount</th>
                        <th className="text-right p-2">Commission</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.map((sale) => (
                        <tr key={sale.id} className="border-b">
                          <td className="p-2">{new Date(sale.sale_date).toLocaleDateString()}</td>
                          <td className="p-2">{sale.videos?.title || 'N/A'}</td>
                          <td className="p-2">{sale.product_name}</td>
                          <td className="p-2">{sale.affiliate_id}</td>
                          <td className="text-right p-2">${parseFloat(sale.sale_amount).toFixed(2)}</td>
                          <td className="text-right p-2">${parseFloat(sale.commission_amount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts">
            <Card>
              <CardHeader>
                <CardTitle>Record Payout</CardTitle>
                <CardDescription>Track commission payments to contributors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Contributor</Label>
                    <Select value={payoutForm.contributorId} onValueChange={(value) => setPayoutForm({...payoutForm, contributorId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select contributor" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.first_name} {user.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={payoutForm.amount}
                      onChange={(e) => setPayoutForm({...payoutForm, amount: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label>Payout Date</Label>
                    <Input
                      type="date"
                      value={payoutForm.payoutDate}
                      onChange={(e) => setPayoutForm({...payoutForm, payoutDate: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label>Notes (Optional)</Label>
                    <Textarea
                      value={payoutForm.notes}
                      onChange={(e) => setPayoutForm({...payoutForm, notes: e.target.value})}
                      placeholder="Payment method, transaction ID, etc."
                    />
                  </div>
                </div>

                <Button onClick={handleRecordPayout} disabled={loading}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Record Payout
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}