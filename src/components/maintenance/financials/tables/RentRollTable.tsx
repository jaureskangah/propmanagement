import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RentRollTableProps {
  rentRoll: {
    unit: string;
    tenant: string;
    rent: number;
    status: string;
  }[];
}

export const RentRollTable = ({ rentRoll }: RentRollTableProps) => {
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
            {rentRoll.map((item, index) => (
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