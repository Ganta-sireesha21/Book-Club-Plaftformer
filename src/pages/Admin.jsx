import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shield, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Admin() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);

    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, email, created_at");

    const { data: roles } = await supabase
      .from("user_roles")
      .select("user_id, role");

    if (profiles) {
      const mapped = profiles.map((p) => ({
        ...p,
        roles: (roles || [])
          .filter((r) => r.user_id === p.user_id)
          .map((r) => r.role),
      }));

      setUsers(mapped);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleAdmin = async (userId, currentlyAdmin) => {
    if (currentlyAdmin) {
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "admin");
    } else {
      await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
    }

    toast({
      title: currentlyAdmin
        ? "Admin role removed"
        : "Admin role granted",
    });

    fetchUsers();
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">
          Access denied. Admin only.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" /> Admin Panel
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage users and roles
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Users className="h-5 w-5" /> Users ({users.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.user_id}>
                    <TableCell className="font-medium">
                      {u.display_name || "—"}
                    </TableCell>

                    <TableCell>{u.email}</TableCell>

                    <TableCell>
                      <div className="flex gap-1">
                        {u.roles.map((r) => (
                          <Badge
                            key={r}
                            variant={r === "admin" ? "default" : "secondary"}
                          >
                            {r}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <Button
                        size="sm"
                        variant={
                          u.roles.includes("admin")
                            ? "destructive"
                            : "outline"
                        }
                        onClick={() =>
                          toggleAdmin(
                            u.user_id,
                            u.roles.includes("admin")
                          )
                        }
                      >
                        {u.roles.includes("admin")
                          ? "Remove Admin"
                          : "Make Admin"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}