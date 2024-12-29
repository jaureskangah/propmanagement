import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  MessageSquare,
  History,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Wrench,
} from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyName: string;
  unitNumber: string;
  leaseStart: string;
  leaseEnd: string;
  rentAmount: number;
  documents: Array<{ id: string; name: string; date: string }>;
  paymentHistory: Array<{ id: string; date: string; amount: number; status: string }>;
  maintenanceRequests: Array<{ id: string; date: string; issue: string; status: string }>;
  communications: Array<{ id: string; date: string; type: string; subject: string }>;
}

interface TenantProfileProps {
  tenant: Tenant;
}

const TenantProfile = ({ tenant }: TenantProfileProps) => {
  console.log("Rendering TenantProfile for:", tenant.name);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-xl">{tenant.name}</CardTitle>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{tenant.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{tenant.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Lease: {tenant.leaseStart} to {tenant.leaseEnd}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Rent: ${tenant.rentAmount}/month</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lease Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenant.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{doc.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{doc.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenant.paymentHistory.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>${payment.amount}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-sm ${
                          payment.status === "Paid"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {payment.status}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {payment.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Maintenance Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenant.maintenanceRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      <span>{request.issue}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-sm ${
                          request.status === "Resolved"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {request.status}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {request.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Communication History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenant.communications.map((comm) => (
                  <div
                    key={comm.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>{comm.subject}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm">{comm.type}</span>
                      <span className="text-sm text-muted-foreground">{comm.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantProfile;