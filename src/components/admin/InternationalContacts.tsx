import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Search, 
  Mail, 
  Calendar,
  MoreHorizontal,
  Globe,
  Download,
  Eye,
  Check,
  MessageSquare
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

export const InternationalContacts = () => {
  const { t } = useLocale();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Fetch international contacts
  const { data: contacts = [], isLoading, error } = useQuery({
    queryKey: ['international_contacts'],
    queryFn: async () => {
      console.log('🔍 Fetching international contacts...');
      
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching contacts:', error);
        throw error;
      }
      
      console.log('✅ Contacts fetched:', data?.length);
      return data || [];
    }
  });

  // Mark contact as processed mutation
  const markAsProcessedMutation = useMutation({
    mutationFn: async (contactId: string) => {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: 'processed' })
        .eq('id', contactId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: t('success'),
        description: t('contactProcessed'),
      });
      queryClient.invalidateQueries({ queryKey: ['international_contacts'] });
    },
    onError: (error: any) => {
      console.error('❌ Error marking contact as processed:', error);
      toast({
        title: t('error'),
        description: t('errorProcessingContact'),
        variant: "destructive",
      });
    },
  });

  const filteredContacts = contacts.filter(contact => 
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    return status === 'processed' ? 
      <Badge variant="secondary" className="gap-1">
        <Check className="h-3 w-3" />
        {t('processed')}
      </Badge> :
      <Badge variant="outline" className="gap-1">
        <MessageSquare className="h-3 w-3" />
        {t('pending')}
      </Badge>;
  };

  const handleViewContact = (contact: ContactMessage) => {
    setSelectedContact(contact);
    setIsContactModalOpen(true);
  };

  const handleMarkAsProcessed = (contactId: string) => {
    markAsProcessedMutation.mutate(contactId);
  };

  const handleExportContacts = () => {
    // Create CSV content
    const csvContent = [
      ['Name', 'Email', 'Message', 'Status', 'Submitted Date'],
      ...filteredContacts.map(contact => [
        contact.name,
        contact.email,
        contact.message.replace(/"/g, '""'), // Escape quotes
        contact.status || 'pending',
        new Date(contact.created_at).toLocaleDateString()
      ])
    ]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `international-contacts-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: t('success'),
      description: t('dataExported'),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">{t('loading')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t('error')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t('internationalContacts')}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t('manageInternationalContacts')}
          </p>
        </div>
        <Button onClick={handleExportContacts} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          {t('exportContacts')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalContacts')}</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('processed')}</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.status === 'processed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('pending')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.status !== 'processed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchContacts')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('contactName')}</TableHead>
                  <TableHead>{t('contactEmail')}</TableHead>
                  <TableHead>{t('contactStatus')}</TableHead>
                  <TableHead>{t('submittedDate')}</TableHead>
                  <TableHead className="text-right">{t('contactActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {t('admin.noContactsFound')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {contact.email}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(contact.status || 'pending')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(contact.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t('contactActions')}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewContact(contact)}>
                              <Eye className="mr-2 h-4 w-4" />
                              {t('viewMessage')}
                            </DropdownMenuItem>
                            {contact.status !== 'processed' && (
                              <DropdownMenuItem 
                                onClick={() => handleMarkAsProcessed(contact.id)}
                                disabled={markAsProcessedMutation.isPending}
                              >
                                <Check className="mr-2 h-4 w-4" />
                                {t('markProcessed')}
                              </DropdownMenuItem>
                            )}
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

      {/* Contact Details Modal */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {t('contactDetails')}
            </DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('contactName')}
                </label>
                <p className="font-medium">{selectedContact.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('contactEmail')}
                </label>
                <p className="font-medium">{selectedContact.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('contactStatus')}
                </label>
                <div className="mt-1">
                  {getStatusBadge(selectedContact.status || 'pending')}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('submittedDate')}
                </label>
                <p className="font-medium">
                  {new Date(selectedContact.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('message')}
                </label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  <p className="text-sm">{selectedContact.message}</p>
                </div>
              </div>
              {selectedContact.status !== 'processed' && (
                <Button 
                  onClick={() => {
                    handleMarkAsProcessed(selectedContact.id);
                    setIsContactModalOpen(false);
                  }}
                  disabled={markAsProcessedMutation.isPending}
                  className="w-full gap-2"
                >
                  <Check className="h-4 w-4" />
                  {t('markProcessed')}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};