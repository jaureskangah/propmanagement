import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Database,
  Zap,
  Shield
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface LogEntry {
  id: string;
  timestamp: string;
  level: string;
  message: string;
  metadata?: any;
  function_id?: string;
  status?: string;
}

export const SupabaseLogs = () => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState("edge-functions");

  // Fetch Edge Functions logs
  const { data: edgeFunctionLogs = [], isLoading: isLoadingEdge, refetch: refetchEdge } = useQuery({
    queryKey: ['edge-function-logs'],
    queryFn: async () => {
      try {
        // Query analytics database for edge function logs
        const { data, error } = await supabase.rpc('get_edge_function_logs');
        if (error) {
          console.error('Error fetching edge function logs:', error);
          return [];
        }
        return data?.map((log: any) => ({
          ...log,
          timestamp: log.log_timestamp
        })) || [];
      } catch (error) {
        console.error('Failed to fetch edge function logs:', error);
        return [];
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch Auth logs
  const { data: authLogs = [], isLoading: isLoadingAuth, refetch: refetchAuth } = useQuery({
    queryKey: ['auth-logs'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('get_auth_logs');
        if (error) {
          console.error('Error fetching auth logs:', error);
          return [];
        }
        return data?.map((log: any) => ({
          ...log,
          timestamp: log.log_timestamp
        })) || [];
      } catch (error) {
        console.error('Failed to fetch auth logs:', error);
        return [];
      }
    },
    refetchInterval: 30000,
  });

  // Fetch Database logs
  const { data: dbLogs = [], isLoading: isLoadingDb, refetch: refetchDb } = useQuery({
    queryKey: ['db-logs'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('get_db_logs');
        if (error) {
          console.error('Error fetching db logs:', error);
          return [];
        }
        return data?.map((log: any) => ({
          ...log,
          timestamp: log.log_timestamp
        })) || [];
      } catch (error) {
        console.error('Failed to fetch db logs:', error);
        return [];
      }
    },
    refetchInterval: 30000,
  });

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR');
  };

  const getLogLevelBadge = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'error':
        return <Badge variant="destructive" className="text-xs"><XCircle className="w-3 h-3 mr-1" />{level}</Badge>;
      case 'warn':
      case 'warning':
        return <Badge variant="default" className="text-xs bg-yellow-500"><AlertCircle className="w-3 h-3 mr-1" />{level}</Badge>;
      case 'info':
        return <Badge variant="secondary" className="text-xs"><CheckCircle className="w-3 h-3 mr-1" />{level}</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{level}</Badge>;
    }
  };

  const getStatusBadge = (status: string | number) => {
    const statusCode = typeof status === 'string' ? parseInt(status) : status;
    if (statusCode >= 200 && statusCode < 300) {
      return <Badge variant="default" className="text-xs bg-green-500">{status}</Badge>;
    } else if (statusCode >= 400) {
      return <Badge variant="destructive" className="text-xs">{status}</Badge>;
    }
    return <Badge variant="outline" className="text-xs">{status}</Badge>;
  };

  const LogsList = ({ logs, isLoading, onRefresh, type }: { 
    logs: LogEntry[], 
    isLoading: boolean, 
    onRefresh: () => void,
    type: string 
  }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {type === 'edge-functions' && <Zap className="w-5 h-5" />}
          {type === 'auth' && <Shield className="w-5 h-5" />}
          {type === 'database' && <Database className="w-5 h-5" />}
          {type === 'edge-functions' && t('edgeFunctionsLogs', { fallback: 'Logs Edge Functions' })}
          {type === 'auth' && t('authLogs', { fallback: 'Logs Authentification' })}
          {type === 'database' && t('databaseLogs', { fallback: 'Logs Base de Données' })}
          <Badge variant="outline" className="text-xs">
            {logs.length}
          </Badge>
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <ScrollArea className="h-[400px] border rounded-md">
        <div className="p-4 space-y-3">
          {logs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {t('noLogsAvailable', { fallback: 'Aucun log disponible' })}
            </div>
          ) : (
            logs.map((log, index) => (
              <div 
                key={log.id || index} 
                className="p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {log.level && getLogLevelBadge(log.level)}
                    {log.status && getStatusBadge(log.status)}
                    {log.function_id && (
                      <Badge variant="outline" className="text-xs">
                        {log.function_id}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-foreground mb-2">
                  {log.message}
                </p>
                
                {log.metadata && (
                  <details className="text-xs text-muted-foreground">
                    <summary className="cursor-pointer hover:text-foreground">
                      {t('metadata', { fallback: 'Métadonnées' })}
                    </summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          {t('supabaseLogs', { fallback: 'Logs Supabase' })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="edge-functions" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Edge Functions</span>
            </TabsTrigger>
            <TabsTrigger value="auth" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Auth</span>
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Database</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edge-functions" className="mt-6">
            <LogsList 
              logs={edgeFunctionLogs} 
              isLoading={isLoadingEdge} 
              onRefresh={refetchEdge}
              type="edge-functions"
            />
          </TabsContent>

          <TabsContent value="auth" className="mt-6">
            <LogsList 
              logs={authLogs} 
              isLoading={isLoadingAuth} 
              onRefresh={refetchAuth}
              type="auth"
            />
          </TabsContent>

          <TabsContent value="database" className="mt-6">
            <LogsList 
              logs={dbLogs} 
              isLoading={isLoadingDb} 
              onRefresh={refetchDb}
              type="database"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};