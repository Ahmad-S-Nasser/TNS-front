import { useState } from "react";
import { Search, Filter, MoreHorizontal, UserPlus, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockUsers = [
  { id: 1, name: "Sara Ahmed", email: "sara@example.com", role: "User", status: "active", joined: "2024-12-01", lastActive: "2 hrs ago" },
  { id: 2, name: "Dr. Khalid Mansour", email: "khalid@example.com", role: "Doctor", status: "active", joined: "2024-11-15", lastActive: "5 min ago" },
  { id: 3, name: "Fatima Al-Hassan", email: "fatima@example.com", role: "User", status: "suspended", joined: "2024-10-20", lastActive: "3 days ago" },
  { id: 4, name: "Omar bin Said", email: "omar@example.com", role: "User", status: "active", joined: "2024-09-10", lastActive: "1 hr ago" },
  { id: 5, name: "Layla Khoury", email: "layla@example.com", role: "User", status: "active", joined: "2025-01-05", lastActive: "30 min ago" },
  { id: 6, name: "Ahmad Nasser", email: "ahmad@example.com", role: "User", status: "active", joined: "2025-01-12", lastActive: "Just now" },
  { id: 7, name: "Nour Abdallah", email: "nour@example.com", role: "User", status: "suspended", joined: "2024-08-22", lastActive: "1 week ago" },
  { id: 8, name: "Dr. Hana Saleh", email: "hana@example.com", role: "Doctor", status: "active", joined: "2024-07-30", lastActive: "10 min ago" },
];

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage app users and their account statuses.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1.5" /> Export
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <UserPlus className="h-4 w-4 mr-1.5" /> Add User
          </Button>
        </div>
      </div>

      <Card className="animate-fade-in">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9 h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-9">
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/30">
                  <TableCell className="pl-6 font-medium text-sm">{user.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "Doctor" ? "default" : "secondary"} className="text-[10px] font-semibold">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold ${
                        user.status === "active"
                          ? "border-success/30 text-success bg-success/5"
                          : "border-destructive/30 text-destructive bg-destructive/5"
                      }`}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.joined}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.lastActive}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
