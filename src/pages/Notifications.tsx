import React, { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationsList } from '@/components/ui/notifications-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { NotificationSettings } from '@/components/notifications/NotificationSettings';
import { Search, BellOff, Bell, BellRing, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NotificationSeverity, NotificationType } from '@/types/enums';

export default function Notifications() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  
  const filters = {
    read: activeTab === 'read' ? true : activeTab === 'unread' ? false : undefined,
    type: typeFilter || undefined,
    severity: severityFilter || undefined,
    search: searchQuery || undefined,
  };
  
  const { 
    notifications, 
    isLoading, 
    totalPages, 
    currentPage,
    onPageChange,
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    settings,
    updateSettings
  } = useNotifications(filters);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Notifications</h1>
        <p className="text-muted-foreground">
          View and manage all notifications
        </p>
      </div>

      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              <Bell className="h-4 w-4 mr-2" />
              Unread
            </TabsTrigger>
            <TabsTrigger value="read">
              <BellOff className="h-4 w-4 mr-2" />
              Read
            </TabsTrigger>
            <TabsTrigger value="settings">
              <BellRing className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => markAllAsRead()}>
              Mark all as read
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All types</SelectItem>
              <SelectItem value={NotificationType.NEW_BOOKING}>New Booking</SelectItem>
              <SelectItem value={NotificationType.MODIFIED_BOOKING}>Modified Booking</SelectItem>
              <SelectItem value={NotificationType.CANCELLED_BOOKING}>Cancelled Booking</SelectItem>
              <SelectItem value={NotificationType.BOOKING_CONFLICT}>Booking Conflict</SelectItem>
              <SelectItem value={NotificationType.SYNC_FAILURE}>Sync Failure</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All severities</SelectItem>
              <SelectItem value={NotificationSeverity.CRITICAL}>Critical</SelectItem>
              <SelectItem value={NotificationSeverity.WARNING}>Warning</SelectItem>
              <SelectItem value={NotificationSeverity.INFO}>Info</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <TabsContent value="all" className="space-y-4">
          <NotificationsList
            notifications={notifications}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
            isLoading={isLoading}
            onMarkAsRead={markAsRead}
            onMarkAllRead={markAllAsRead}
            onDelete={deleteNotification}
          />
        </TabsContent>
        
        <TabsContent value="unread" className="space-y-4">
          <NotificationsList
            notifications={notifications}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
            isLoading={isLoading}
            onMarkAsRead={markAsRead}
            onMarkAllRead={markAllAsRead}
            onDelete={deleteNotification}
          />
        </TabsContent>
        
        <TabsContent value="read" className="space-y-4">
          <NotificationsList
            notifications={notifications}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
            isLoading={isLoading}
            onMarkAsRead={markAsRead}
            onMarkAllRead={markAllAsRead}
            onDelete={deleteNotification}
          />
        </TabsContent>
        
        <TabsContent value="settings">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
