
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocale } from "@/components/providers/LocaleProvider";

interface MaintenanceTableProps {
  maintenance: {
    title: string;
    description: string;
    cost: number;
    date: string;
  }[];
}

export const MaintenanceTable = ({ maintenance }: MaintenanceTableProps) => {
  const { t } = useLocale();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('maintenanceTitle')}</CardTitle>
        <CardDescription>{t('maintenanceAndRepairs')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('columnTitle')}</TableHead>
              <TableHead>{t('columnDescription')}</TableHead>
              <TableHead>{t('columnCost')}</TableHead>
              <TableHead>{t('columnDate')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenance.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>${item.cost.toLocaleString()}</TableCell>
                <TableCell>{item.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
