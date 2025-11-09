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

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  serial_number: string;
  created_at: string;
  roles: string[];
}

const AdminUserManagement = () => {
  const { toast } = useToast();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    
    // Fetch both profiles and user roles
    const [profilesResult, rolesResult] = await Promise.all([
      supabase.from("profiles").select("id, first_name, last_name, serial_number, email, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*").order("created_at", { ascending: false })
    ]);

    if (profilesResult.error) {
      toast({
        title: "Error",
        description: "Failed to load user profiles",
        variant: "destructive",
      });
    } else {
      // Merge profiles with roles
      const profilesWithRoles = (profilesResult.data || []).map((profile: any) => {
        const userRoles = (rolesResult.data || [])
          .filter((r: any) => r.user_id === profile.id)
          .map((r: any) => r.role);
        
        return {
          ...profile,
          roles: userRoles
        };
      });
      
      setProfiles(profilesWithRoles);
    }

    if (!rolesResult.error) {
      setUserRoles(rolesResult.data || []);
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
        loadUserData();
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
      loadUserData();
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* All Signup Users Section */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">All Signup Users ({profiles.length})</h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serial Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Registered</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-xs">
                    {profile.serial_number}
                  </Badge>
                </TableCell>
                <TableCell>
                  {profile.first_name || profile.last_name 
                    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                    : <span className="text-muted-foreground">No name</span>
                  }
                </TableCell>
                <TableCell>{profile.email || <span className="text-muted-foreground">No email</span>}</TableCell>
                <TableCell>
                  {profile.roles.length > 0 ? (
                    <div className="flex gap-1 flex-wrap">
                      {profile.roles.map((role, idx) => (
                        <Badge key={idx} variant={role === "admin" ? "default" : "secondary"}>
                          {role}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No roles</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(profile.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Role Management Section */}
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
          <div className="bg-muted p-3 rounded-md text-sm text-muted-foreground mb-2">
            Note: Only the first admin (earliest registered) can add new admins.
          </div>
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
