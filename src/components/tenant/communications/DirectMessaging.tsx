
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Send, MessageSquare } from "lucide-react";
import { Communication } from "@/types/tenant";

interface DirectMessagingProps {
  tenantId: string;
  onMessageSent: () => void;
  latestMessages: Communication[];
}

export const DirectMessaging = ({ tenantId, onMessageSent, latestMessages = [] }: DirectMessagingProps) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: t('error'),
        description: t('messageCantBeEmpty'),
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('tenant_communications')
        .insert({
          tenant_id: tenantId,
          type: 'message',
          subject: t('maintenanceIssue'),
          content: message,
          category: 'maintenance',
          is_from_tenant: false,
          status: 'unread'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setMessage('');
      toast({
        title: t('success'),
        description: t('messageSent'),
      });
      
      onMessageSent();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: t('error'),
        description: t('errorSendingMessage'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          {t('directMessaging')}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {latestMessages.length > 0 ? (
            <div className="space-y-3 max-h-48 overflow-y-auto border rounded-md p-3">
              {latestMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`p-3 rounded-lg ${msg.is_from_tenant 
                    ? 'bg-gray-100 ml-6 dark:bg-gray-800' 
                    : 'bg-blue-100 mr-6 dark:bg-blue-900/30'}`}
                >
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {new Date(msg.created_at).toLocaleString()}
                    {msg.is_from_tenant && ` • ${t('fromTenant')}`}
                  </div>
                  <p className="text-sm">{msg.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 p-4">
              {t('noMessages')}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('typeYourMessage')}
              className="min-h-24"
            />
          </form>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || !message.trim()} 
          className="flex items-center gap-1"
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? t('sending') : t('send')}
        </Button>
      </CardFooter>
    </Card>
  );
};
