import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, UserPlus, Trash2 } from "lucide-react";

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

const AdminUserManagement = () => {
  const { toast } = useToast();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadUserRoles();
  }, []);

  const loadUserRoles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load user roles",
        variant: "destructive",
      });
    } else {
      setUserRoles(data || []);
    }
    setLoading(false);
  };

  const addAdmin = async () => {
    if (!newAdminEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setAdding(true);
    try {
      // Get user by email (this requires service role, so we use edge function)
      const { data, error } = await supabase.functions.invoke("assign-admin-role", {
        body: { email: newAdminEmail },
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Success",
          description: "Admin role assigned successfully",
        });
        setNewAdminEmail("");
        loadUserRoles();
      } else {
        throw new Error(data?.error || "Failed to assign admin role");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign admin role",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const deleteRole = async (roleId: string) => {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("id", roleId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
      loadUserRoles();
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">User Role Management</h2>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add New Admin
          </h3>
          <div className="flex gap-2">
            <Input
              placeholder="Enter user email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              type="email"
            />
            <Button onClick={addAdmin} disabled={adding}>
              {adding ? "Adding..." : "Add Admin"}
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Current User Roles</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userRoles.map((userRole) => (
                <TableRow key={userRole.id}>
                  <TableCell className="font-mono text-xs">
                    {userRole.user_id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge variant={userRole.role === "admin" ? "default" : "secondary"}>
                      {userRole.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(userRole.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteRole(userRole.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default AdminUserManagement;
