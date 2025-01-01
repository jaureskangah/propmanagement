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

interface RentRollTableProps {
  propertyId: string;
}

export const RentRollTable = ({ propertyId }: RentRollTableProps) => {
  const { data: rentRoll, isLoading } = useQuery({
    queryKey: ["rentRoll", propertyId],
    queryFn: async () => {
      console.log("Fetching rent roll data for property:", propertyId);
      const { data, error } = await supabase
        .from("tenants")
        .select("unit_number, name, rent_amount, lease_end")
        .eq("property_id", propertyId)
        .order("unit_number");

      if (error) {
        console.error("Error fetching rent roll:", error);
        throw error;
      }

      console.log("Rent roll data fetched:", data);
      return data.map(tenant => ({
        unit: tenant.unit_number,
        tenant: tenant.name,
        rent: tenant.rent_amount,
        status: new Date(tenant.lease_end) > new Date() ? "Active" : "Expired"
      }));
    },
  });

  if (isLoading) {
    return <div>Loading rent roll data...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rent Roll</CardTitle>
        <CardDescription>Current tenant and rent information</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Unit</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Rent</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentRoll?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.tenant}</TableCell>
                <TableCell>${item.rent.toLocaleString()}</TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};