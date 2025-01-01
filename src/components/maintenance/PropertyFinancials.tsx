import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, FileText, TrendingUp, Wrench } from "lucide-react";
import { MonthlyExpensesChart } from "./financials/charts/MonthlyExpensesChart";
import { ExpensesByCategoryChart } from "./financials/charts/ExpensesByCategoryChart";
import { ExpensesTrendChart } from "./financials/charts/ExpensesTrendChart";

interface PropertyFinancialsProps {
  propertyId: string;
  rentRoll: {
    unit: string;
    tenant: string;
    rent: number;
    status: string;
  }[];
  expenses: {
    category: string;
    amount: number;
    date: string;
  }[];
  maintenance: {
    description: string;
    cost: number;
    date: string;
  }[];
}

export const PropertyFinancials = ({ propertyId, rentRoll, expenses, maintenance }: PropertyFinancialsProps) => {
  console.log("Rendering PropertyFinancials for property:", propertyId);

  // Calculate ROI
  const calculateROI = () => {
    const totalRent = rentRoll.reduce((acc, curr) => acc + curr.rent, 0) * 12;
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalMaintenance = maintenance.reduce((acc, curr) => acc + curr.cost, 0);
    const netIncome = totalRent - totalExpenses - totalMaintenance;
    // Assuming a property value for demonstration
    const propertyValue = 500000;
    return ((netIncome / propertyValue) * 100).toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rent Roll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${rentRoll.reduce((acc, curr) => acc + curr.rent, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Monthly total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${expenses.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Year to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Costs</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${maintenance.reduce((acc, curr) => acc + curr.cost, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Year to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateROI()}%</div>
            <p className="text-xs text-muted-foreground">Annual return</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MonthlyExpensesChart expenses={expenses} />
        <ExpensesByCategoryChart expenses={expenses} />
        <ExpensesTrendChart expenses={expenses} />
      </div>

      {/* Rent Roll Table */}
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

      {/* Tables Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>Property-specific expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense, index) => (
                  <TableRow key={index}>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>${expense.amount.toLocaleString()}</TableCell>
                    <TableCell>{expense.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Maintenance Costs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance</CardTitle>
            <CardDescription>Maintenance and repairs tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenance.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>${item.cost.toLocaleString()}</TableCell>
                    <TableCell>{item.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};