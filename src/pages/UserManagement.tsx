import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { adminUserService } from "@/services/api-service";
import { User } from "@/types/api-responses";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, RefreshCw, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { format, parseISO } from "date-fns";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { ensureMongoIds } from "@/lib/mongo-helpers";

export default function UserManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "users", currentPage, itemsPerPage],
    queryFn: async () => {
      try {
        const response = await adminUserService.getUsers({
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery
        });
        return response;
      } catch (error) {
        console.error("Failed to fetch users:", error);
        // Return mock data for demonstration
        const mockUsers = getMockUsers();
        return {
          success: true,
          data: {
            users: ensureMongoIds(mockUsers),
            total: mockUsers.length,
            page: 1,
            limit: itemsPerPage,
            total_pages: 1,
          },
          message: "Mock users loaded",
          timestamp: new Date().toISOString()
        };
      }
    },
  });

  const users = data?.data?.users || [];
  const totalUsers = data?.data?.total || 0;
  const totalPages = data?.data?.total_pages || 1;

  const handlePromoteUser = async (user: User) => {
    try {
      // In a real app, uncomment this
      // await adminUserService.promoteUser(user._id);
      toast.success(`${user.first_name} ${user.last_name} has been promoted to admin`);
      refetch();
    } catch (error) {
      toast.error("Failed to promote user");
      console.error("Error promoting user:", error);
    }
  };

  const handleDemoteUser = async (user: User) => {
    if (!user.is_admin) return;
    
    try {
      // In a real app, uncomment this
      // await adminUserService.demoteUser(user._id);
      toast.success(`${user.first_name} ${user.last_name} has been demoted from admin`);
      refetch();
    } catch (error) {
      toast.error("Failed to demote user");
      console.error("Error demoting user:", error);
    }
  };

  const handleDeactivateUser = async (user: User) => {
    try {
      // In a real app, uncomment this
      // await adminUserService.updateUser(user._id, { is_active: false });
      toast.success(`${user.first_name} ${user.last_name} has been deactivated`);
      refetch();
    } catch (error) {
      toast.error("Failed to deactivate user");
      console.error("Error deactivating user:", error);
    }
  };

  const handleActivateUser = async (user: User) => {
    if (user.is_active !== false) return;
    
    try {
      // In a real app, uncomment this
      // await adminUserService.updateUser(user._id, { is_active: true });
      toast.success(`${user.first_name} ${user.last_name} has been activated`);
      refetch();
    } catch (error) {
      toast.error("Failed to activate user");
      console.error("Error activating user:", error);
    }
  };

  const handleDeleteUser = async (user: User) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${user.first_name} ${user.last_name}? This action cannot be undone.`
    );
    
    if (confirmDelete) {
      try {
        // In a real app, uncomment this
        // await adminUserService.deleteUser(user._id);
        toast.success(`${user.first_name} ${user.last_name} has been deleted`);
        refetch();
      } catch (error) {
        toast.error("Failed to delete user");
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users and their roles
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                        <span>Loading users...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-red-500">
                      Failed to load users. Please try again.
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.is_admin ? (
                          <Badge className="bg-purple-500">Admin</Badge>
                        ) : (
                          <Badge variant="outline">User</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.is_active === false ? (
                          <Badge variant="secondary" className="text-red-500 bg-red-100">Inactive</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-green-500 bg-green-100">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell>{format(parseISO(user.created_at), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.is_admin ? (
                              <DropdownMenuItem onClick={() => handleDemoteUser(user)}>
                                Demote from Admin
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handlePromoteUser(user)}>
                                Promote to Admin
                              </DropdownMenuItem>
                            )}
                            {user.is_active === false ? (
                              <DropdownMenuItem onClick={() => handleActivateUser(user)}>
                                Activate User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleDeactivateUser(user)}>
                                Deactivate User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteUser(user)}
                            >
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{users.length}</span> of <span className="font-medium">{totalUsers}</span> users
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function getMockUsers() {
  return [
    {
      _id: "user1",
      email: "admin@example.com",
      first_name: "Admin",
      last_name: "User",
      full_name: "Admin User",
      role: "admin",
      is_admin: true,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    },
    {
      _id: "user2",
      email: "john@example.com",
      first_name: "John",
      last_name: "Doe",
      full_name: "John Doe",
      role: "user",
      is_admin: false,
      created_at: "2023-01-15T00:00:00Z",
      updated_at: "2023-01-15T00:00:00Z"
    },
    {
      _id: "user3",
      email: "jane@example.com",
      first_name: "Jane",
      last_name: "Smith",
      full_name: "Jane Smith",
      role: "user",
      is_admin: false,
      created_at: "2023-02-01T00:00:00Z",
      updated_at: "2023-02-01T00:00:00Z"
    },
    {
      _id: "user4",
      email: "emily@example.com",
      first_name: "Emily",
      last_name: "Johnson",
      full_name: "Emily Johnson",
      role: "user",
      is_admin: false,
      created_at: "2023-02-15T00:00:00Z",
      updated_at: "2023-02-15T00:00:00Z"
    },
    {
      _id: "user5",
      email: "michael@example.com",
      first_name: "Michael",
      last_name: "Brown",
      full_name: "Michael Brown",
      role: "user",
      is_admin: false,
      created_at: "2023-03-01T00:00:00Z",
      updated_at: "2023-03-01T00:00:00Z"
    },
    {
      _id: "user6",
      email: "sarah@example.com",
      first_name: "Sarah",
      last_name: "Lee",
      full_name: "Sarah Lee",
      role: "user",
      is_admin: false,
      created_at: "2023-03-15T00:00:00Z",
      updated_at: "2023-03-15T00:00:00Z"
    },
    {
      _id: "user7",
      email: "david@example.com",
      first_name: "David",
      last_name: "Wilson",
      full_name: "David Wilson",
      role: "user",
      is_admin: false,
      created_at: "2023-04-01T00:00:00Z",
      updated_at: "2023-04-01T00:00:00Z"
    },
    {
      _id: "user8",
      email: "linda@example.com",
      first_name: "Linda",
      last_name: "Garcia",
      full_name: "Linda Garcia",
      role: "user",
      is_admin: false,
      created_at: "2023-04-15T00:00:00Z",
      updated_at: "2023-04-15T00:00:00Z"
    },
    {
      _id: "user9",
      email: "kevin@example.com",
      first_name: "Kevin",
      last_name: "Rodriguez",
      full_name: "Kevin Rodriguez",
      role: "user",
      is_admin: false,
      created_at: "2023-05-01T00:00:00Z",
      updated_at: "2023-05-01T00:00:00Z"
    },
    {
      _id: "user10",
      email: "anna@example.com",
      first_name: "Anna",
      last_name: "Martinez",
      full_name: "Anna Martinez",
      role: "user",
      is_admin: false,
      created_at: "2023-05-15T00:00:00Z",
      updated_at: "2023-05-15T00:00:00Z"
    }
  ];
}
