
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlatformSelect } from '@/components/sync/PlatformSelect';
import { LogDetailsModal } from '@/components/sync/LogDetailsModal';
import { LogActionButton } from '@/components/sync/LogActionButton';
import { syncService } from '@/services/sync-service';
import { SyncStatus, Platform } from '@/types/enums';
import { SyncLog } from '@/types/api-responses/sync-types';
import { Search, Filter, DownloadCloud } from 'lucide-react';

export default function SyncLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<SyncStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedLog, setSelectedLog] = useState<SyncLog | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['syncLogs', searchQuery, platformFilter, statusFilter, page, limit],
    queryFn: async () => {
      const params = {
        search: searchQuery,
        platform: platformFilter === 'all' ? undefined : platformFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
        page: page,
        limit: limit,
      };
      
      try {
        const response = await syncService.getSyncLogs(params);
        return response.data;
      } catch (err) {
        console.error('Error fetching sync logs:', err);
        throw err;
      }
    }
  });

  // Safely extract logs and pagination from the response
  const syncLogs: SyncLog[] = data?.data?.logs || [];
  const pagination = data?.data?.pagination || { 
    total: 0, 
    page: 1, 
    limit: 10, 
    pages: 1, 
    has_next_page: false, 
    has_previous_page: false 
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleOpenLogDetails = (log: SyncLog) => {
    setSelectedLog(log);
  };

  const handleCloseLogDetails = () => {
    setSelectedLog(null);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sync Logs</CardTitle>
          <CardDescription>View and manage synchronization logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-4">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as SyncStatus | 'all')}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.values(SyncStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <PlatformSelect
                onChange={(value) => setPlatformFilter(value as Platform | 'all')}
              />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {isLoading ? (
            <div className="text-center">Loading logs...</div>
          ) : error ? (
            <div className="text-center text-red-500">Error: {(error as Error).message}</div>
          ) : syncLogs.length === 0 ? (
            <div className="text-center">No sync logs found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {syncLogs.map((log) => (
                    <tr key={log._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.property?.name || log.property_id || 'All Properties'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.platform}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.created_at ? new Date(log.created_at).toLocaleString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.action || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <LogActionButton 
                          log={log}
                          onOpenDetails={handleOpenLogDetails} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              disabled={page === 1 || !pagination.has_previous_page}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </Button>
            <span>
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              disabled={page === pagination.pages || !pagination.has_next_page}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
      {selectedLog && (
        <LogDetailsModal 
          log={selectedLog} 
          open={!!selectedLog} 
          onClose={handleCloseLogDetails} 
        />
      )}
    </div>
  );
}
