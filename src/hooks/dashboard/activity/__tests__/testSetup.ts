
import React from "react";
import { Activity } from "../../activityTypes";

// Mock activity data for testing
export const mockActivities: Activity[] = [
  {
    id: "tenant-1",
    created_at: new Date(2023, 6, 1).toISOString(), // July 1, 2023
    type: "tenant",
    component: React.createElement("div", { "data-testid": "tenant-component" }, "Tenant Activity")
  },
  {
    id: "payment-1",
    created_at: new Date(2023, 7, 15).toISOString(), // August 15, 2023
    type: "payment",
    component: React.createElement("div", { "data-testid": "payment-component" }, "Payment Activity")
  },
  {
    id: "maintenance-1",
    created_at: new Date().toISOString(), // Today
    type: "maintenance",
    component: React.createElement("div", { "data-testid": "maintenance-component" }, "Maintenance Activity")
  },
  {
    id: "payment-2",
    created_at: new Date(2023, 8, 5).toISOString(), // September 5, 2023
    type: "payment",
    component: React.createElement("div", { "data-testid": "payment-component-2" }, "Another Payment")
  }
];

// Mock data for specific date ranges
export const mockActivitiesForDates = {
  today: mockActivities.filter(a => a.id === "maintenance-1"),
  older: mockActivities.filter(a => a.id !== "maintenance-1")
};

// Mock API data
export const mockTenants = [
  { id: "tenant-1", name: "John Doe", unit_number: "101", created_at: new Date(2023, 6, 1).toISOString() }
];

export const mockPayments = [
  { 
    id: "payment-1", 
    amount: 1000, 
    created_at: new Date(2023, 7, 15).toISOString(),
    tenants: { unit_number: "101" }
  },
  { 
    id: "payment-2", 
    amount: 1200, 
    created_at: new Date(2023, 8, 5).toISOString(),
    tenants: { unit_number: "102" }
  }
];

export const mockMaintenance = [
  { id: "maintenance-1", issue: "Broken sink", created_at: new Date().toISOString() }
];
