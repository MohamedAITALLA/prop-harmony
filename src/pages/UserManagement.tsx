
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ActionMenu from "@/components/admin/ActionMenu";
import RoleBadge from "@/components/admin/RoleBadge";
import StatusToggle from "@/components/admin/StatusToggle";
import UserForm from "@/components/admin/UserForm";
import { Search, Plus, Filter, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { adminUserService } from "@/services/api-service";
import { toast } from "sonner";
import { User } from "@/types/api-responses";
import { ensureMongoIds } from '@/lib/mongo-helpers';
import { convertToMongoIdFormat } from '@/lib/id-conversion';

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const pageSize = 10;
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users", currentPage, activeTab],
    queryFn: async () => {
      try {
        const params: any = {
          page: currentPage,
          limit: pageSize
        };
        
        if (activeTab !== "all") {
          if (activeTab === "admin") {
            params.role = "admin";
          } else if (activeTab === "active") {
            params.status = "active";
          } else if (activeTab === "inactive") {
            params.status = "inactive";
          }
        }
        
        if (searchQuery.trim()) {
          params.search = searchQuery;
        }
        
        const response = await adminUserService.getUsers(params);
        return response;
      } catch (error) {
        console.error("Error fetching users:", error);
        return {
          data: {
            users: [],
            total: 0,
            page: 1,
            limit: pageSize,
            total_pages: 1
          }
        };
      }
    }
  });
  
  const handleCreate = async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    is_active?: boolean;
    role?: string;
  }) => {
    try {
      await adminUserService.createUser(userData);
      toast.success("User created successfully");
      setIsAddUserDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    }
  };
  
  const handleUpdate = async (id: string, userData: Partial<{
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    is_active: boolean;
    role: string;
  }>) => {
    try {
      await adminUserService.updateUser(id, userData);
      toast.success("User updated successfully");
      setIsEditUserDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await adminUserService.deleteUser(id);
        toast.success("User deleted successfully");
        refetch();
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user");
      }
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };
  
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= (data?.data.total_pages || 1)) {
      setCurrentPage(page);
    }
  };
  
  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setIsEditUserDialogOpen(true);
  };
  
  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await adminUserService.updateUser(userId, { is_active: !isActive });
      toast.success("User status updated");
      refetch();
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const mockUsers = [
    convertToMongoIdFormat({
      _id: "1",
      email: "admin@example.com",
      first_name: "Admin",
      last_name: "User",
      full_name: "Admin User",
      role: "admin",
      is_admin: true,
      is_active: true,
      created_at: "2023-01-01T00:00:00.000Z",
      updated_at: "2023-01-01T00:00:00.000Z"
    }),
    convertToMongoIdFormat({
      _id: "2",
      email: "user@example.com",
      first_name: "Regular",
      last_name: "User",
      full_name: "Regular User",
      role: "user",
      is_admin: false,
      is_active: true,
      created_at: "2023-01-02T00:00:00.000Z",
      updated_at: "2023-01-02T00:00:00.000Z"
    }),
  ];
  
  const users = data?.data?.users || mockUsers;
  
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 md:mt-0">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                className="pl-10 w-full md:w-[300px]"
                placeholder="Search users..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" variant="outline" className="ml-2">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
          </form>
          
          <Button onClick={() => setIsAddUserDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add User
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableCaption>
                  {users.length === 0 ? (
                    "No users found matching your criteria."
                  ) : (
                    `A list of users - Page ${currentPage} of ${data?.data.total_pages || 1}`
                  )}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: User) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <RoleBadge role={user.role} />
                      </TableCell>
                      <TableCell>
                        <StatusToggle 
                          userId={user._id}
                          isActive={user.is_active}
                          onToggle={() => handleToggleUserStatus(user._id, user.is_active)}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionMenu
                          onEdit={() => handleEditUser(user)}
                          onDelete={() => handleDelete(user._id)}
                          onViewProfile={() => window.location.href = `/admin/user-profiles/${user._id}`}
                          isAdmin={user.is_admin}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {data && data.data.total_pages > 1 && (
            <div className="flex justify-center mt-8">
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center mx-4">
                Page {currentPage} of {data.data.total_pages}
              </div>
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === data.data.total_pages}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. All fields are required.
            </DialogDescription>
          </DialogHeader>
          
          <UserForm onSubmit={handleCreate} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Leave password blank to keep current password.
            </DialogDescription>
          </DialogHeader>
          
          {currentUser && (
            <UserForm 
              user={currentUser} 
              onSubmit={(userData) => handleUpdate(currentUser._id, userData)} 
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
