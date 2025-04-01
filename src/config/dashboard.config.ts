
import { 
  LayoutDashboard, Home, Calendar, Bell, AlertTriangle, RefreshCw, 
  BarChart3, User, Settings, Shield 
} from "lucide-react";

export type SidebarItemType = {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  path: string;
  badge?: "count" | "status";
  role?: string;
};

export type SidebarSectionType = {
  title: string;
  items: SidebarItemType[];
};

export type HeaderComponentType = {
  type: "logo" | "sidebar-toggle" | "search" | "notifications" | "user-menu";
  placeholder?: string;
  items?: string[];
};

export type DashboardCardType = {
  title: string;
  value: string;
  icon: string;
  change?: string;
  variant?: "default" | "warning" | "success" | "danger";
  action?: string;
};

export type DashboardSectionType = {
  name: string;
  layout: "grid" | "full-width" | "list" | "table";
  columns?: number;
  component?: string;
  cards?: DashboardCardType[];
  height?: string;
  limit?: number;
  action?: string;
  columns_config?: string[];
};

export type DashboardConfigType = {
  sidebar: {
    sections: SidebarSectionType[];
  };
  header: {
    components: HeaderComponentType[];
  };
  overview_page: {
    sections: DashboardSectionType[];
  };
};

export const dashboardConfig: DashboardConfigType = {
  sidebar: {
    sections: [
      {
        title: "Main",
        items: [
          {
            name: "Dashboard",
            icon: LayoutDashboard,
            path: "/dashboard"
          },
          {
            name: "Properties",
            icon: Home,
            path: "/properties"
          },
          {
            name: "Calendar",
            icon: Calendar,
            path: "/calendar"
          },
          {
            name: "Notifications",
            icon: Bell,
            path: "/notifications",
            badge: "count"
          }
        ]
      },
      {
        title: "Management",
        items: [
          {
            name: "Conflicts",
            icon: AlertTriangle,
            path: "/conflicts",
            badge: "count"
          },
          {
            name: "Synchronization",
            icon: RefreshCw,
            path: "/sync"
          },
          {
            name: "Analytics",
            icon: BarChart3,
            path: "/analytics"
          }
        ]
      },
      {
        title: "Settings",
        items: [
          {
            name: "Profile",
            icon: User,
            path: "/profile"
          },
          {
            name: "Preferences",
            icon: Settings,
            path: "/preferences"
          },
          {
            name: "Admin",
            icon: Shield,
            path: "/admin",
            role: "admin"
          }
        ]
      }
    ]
  },
  header: {
    components: [
      { type: "logo" },
      { type: "sidebar-toggle" },
      { type: "search", placeholder: "Search properties, bookings..." },
      { type: "notifications" },
      { 
        type: "user-menu", 
        items: ["Profile", "Settings", "Help", "Logout"] 
      }
    ]
  },
  overview_page: {
    sections: [
      {
        name: "Stats Overview",
        layout: "grid",
        columns: 4,
        cards: [
          {
            title: "Total Properties",
            value: "{count}",
            icon: "home",
            change: "+{number}% from last month"
          },
          {
            title: "Active Bookings",
            value: "{count}",
            icon: "calendar-check",
            change: "+{number}% from last month"
          },
          {
            title: "Occupancy Rate",
            value: "{percentage}%",
            icon: "percent",
            change: "+{number}% from last month"
          },
          {
            title: "Pending Conflicts",
            value: "{count}",
            icon: "alert-triangle",
            variant: "warning",
            action: "View All"
          }
        ]
      },
      {
        name: "Properties Overview",
        layout: "grid",
        columns: 3,
        component: "PropertyCards",
        action: "View All Properties"
      },
      {
        name: "Calendar Overview",
        layout: "full-width",
        component: "MiniCalendar",
        height: "300px",
        action: "Open Full Calendar"
      },
      {
        name: "Recent Notifications",
        layout: "list",
        component: "NotificationsList",
        limit: 5,
        action: "View All Notifications"
      },
      {
        name: "Synchronization Status",
        layout: "table",
        component: "SyncStatusTable",
        columns_config: [
          "Platform",
          "Last Sync",
          "Status",
          "Actions"
        ],
        action: "Sync All Now"
      }
    ]
  }
};
