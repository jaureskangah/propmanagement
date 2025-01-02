import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { RentRollData } from "./types";

interface RentRollTableContentProps {
  rentRollData: RentRollData[];
}

export const RentRollTableContent = ({ rentRollData }: RentRollTableContentProps) => {
  if (rentRollData.length === 0) {
    return <div className="text-center py-4">No rent roll data available</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tenant</TableHead>
          <TableHead>Monthly Rent</TableHead>
          <TableHead>Last Payment</TableHead>
          <TableHead>Payment Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Lease End</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rentRollData.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.name}</TableCell>
            <TableCell>${row.rent_amount}</TableCell>
            <TableCell>
              {row.lastPayment ? `$${row.lastPayment.amount}` : "No payment"}
            </TableCell>
            <TableCell>
              {row.lastPayment ? formatDate(row.lastPayment.date) : "N/A"}
            </TableCell>
            <TableCell>
              {row.lastPayment ? (
                <Badge
                  variant={row.lastPayment.status === "Paid" ? "success" : "destructive"}
                >
                  {row.lastPayment.status}
                </Badge>
              ) : (
                <Badge variant="secondary">No payment</Badge>
              )}
            </TableCell>
            <TableCell>{formatDate(row.lease_end)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};