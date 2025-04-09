
import { useNavigate } from "react-router-dom";
import { LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarFooterProps {
  user: any;
  notificationCount: number;
  logout: () => void;
}

export const SidebarFooter = ({ user, notificationCount, logout }: SidebarFooterProps) => {
  const navigate = useNavigate();
  
  // Get the profile image URL or generate an avatar based on name
  const profileImage = user?.profile_image || `https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}`;
  
  return (
    <div className="mt-auto p-4 border-t">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={profileImage} />
            <AvatarFallback>{user?.first_name?.[0]}{user?.last_name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{user?.first_name} {user?.last_name}</p>
            <p className="text-muted-foreground text-xs">{user?.email}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/notifications")}
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 text-xs flex items-center justify-center rounded-full bg-primary text-primary-foreground">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </Button>
      </div>
      <Button 
        variant="outline" 
        className="w-full justify-start" 
        onClick={logout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </Button>
    </div>
  );
};
