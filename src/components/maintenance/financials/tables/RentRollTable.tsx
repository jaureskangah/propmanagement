import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { parseDateSafe } from "@/lib/date";

interface RentRollTableProps {
  propertyId: string;
}

export const RentRollTable = ({ propertyId }: RentRollTableProps) => {
  const { data: rentRoll, isLoading } = useQuery({
    queryKey: ["rentRoll", propertyId],
    queryFn: async () => {
      console.log("Fetching rent roll data for property:", propertyId);
      const { data: tenants, error: tenantsError } = await supabase
        .from("tenants")
        .select(`
          id,
          unit_number,
          name,
          rent_amount,
          lease_end,
          tenant_payments!inner (
            amount,
            status,
            payment_date
          )
        `)
        .eq("property_id", propertyId)
        .order("unit_number");

      if (tenantsError) {
        console.error("Error fetching rent roll:", tenantsError);
        throw tenantsError;
      }

      console.log("Rent roll data fetched:", tenants);
      
      return tenants?.map(tenant => {
        // Get the most recent payment
        const latestPayment = tenant.tenant_payments
          ?.sort((a, b) => parseDateSafe(b.payment_date).getTime() - parseDateSafe(a.payment_date).getTime())[0];

        return {
          unit: tenant.unit_number,
          tenant: tenant.name,
          rent: tenant.rent_amount,
          status: parseDateSafe(tenant.lease_end) > new Date() ? "Active" : "Expired",
          lastPayment: latestPayment ? {
            amount: latestPayment.amount,
            date: latestPayment.payment_date,
            status: latestPayment.status
          } : null
        };
      }) || [];
    },
  });

  if (isLoading) {
    return <div>Loading rent roll data...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rent Roll</CardTitle>
        <CardDescription>Current tenant and payment information</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Unit</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Monthly Rent</TableHead>
              <TableHead>Last Payment</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Lease Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentRoll?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.tenant}</TableCell>
                <TableCell>${item.rent.toLocaleString()}</TableCell>
                <TableCell>
                  {item.lastPayment ? (
                    <>
                      ${item.lastPayment.amount.toLocaleString()}
                      <br />
                      <span className="text-sm text-muted-foreground">
                        {format(parseDateSafe(item.lastPayment.date), 'MMM d, yyyy')}
                      </span>
                    </>
                  ) : (
                    "No payments"
                  )}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    item.lastPayment?.status === 'paid' 
                      ? 'bg-green-100 text-green-800'
                      : item.lastPayment?.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.lastPayment?.status || 'No payment'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'Active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};