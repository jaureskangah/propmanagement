import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import PropertyFinancials from "@/components/PropertyFinancials";

// Mock data - replace with real data when backend is integrated
const initialProperties = [
  {
    id: "1",
    name: "Maple Heights",
    address: "123 Maple Street, Toronto, ON",
    units: 4,
    type: "Apartment Building",
    financials: {
      rentRoll: [
        { unit: "101", tenant: "John Doe", rent: 1500, status: "Current" },
        { unit: "102", tenant: "Jane Smith", rent: 1600, status: "Current" },
        { unit: "103", tenant: "Bob Johnson", rent: 1550, status: "Late" },
        { unit: "104", tenant: "Alice Brown", rent: 1700, status: "Current" },
      ],
      expenses: [
        { category: "Insurance", amount: 2400, date: "2024-01-15" },
        { category: "Property Tax", amount: 5000, date: "2024-02-01" },
        { category: "Utilities", amount: 1200, date: "2024-03-01" },
      ],
      maintenance: [
        { description: "HVAC Repair", cost: 800, date: "2024-02-15" },
        { description: "Plumbing", cost: 500, date: "2024-03-10" },
        { description: "Paint Common Areas", cost: 1200, date: "2024-03-20" },
      ],
    },
  },
  {
    id: "2",
    name: "Pine Valley Homes",
    address: "456 Pine Road, Vancouver, BC",
    units: 2,
    type: "Duplex",
    financials: {
      rentRoll: [
        { unit: "A", tenant: "Sarah Wilson", rent: 2200, status: "Current" },
        { unit: "B", tenant: "Mike Davis", rent: 2100, status: "Current" },
      ],
      expenses: [
        { category: "Insurance", amount: 1800, date: "2024-01-15" },
        { category: "Property Tax", amount: 3500, date: "2024-02-01" },
      ],
      maintenance: [
        { description: "Roof Repair", cost: 1500, date: "2024-02-01" },
        { description: "Landscaping", cost: 400, date: "2024-03-15" },
      ],
    },
  },
];

const Properties = () => {
  const [properties, setProperties] = useState(initialProperties);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  console.log("Rendering Properties page with", properties.length, "properties");

  const handleEdit = (id: string) => {
    console.log("Edit property:", id);
    // Implement edit functionality
  };

  const handleDelete = (id: string) => {
    console.log("Delete property:", id);
    setProperties(properties.filter(property => property.id !== id));
    if (selectedPropertyId === id) {
      setSelectedPropertyId(null);
    }
  };

  const handleViewFinancials = (id: string) => {
    console.log("View financials for property:", id);
    setSelectedPropertyId(id);
  };

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Property
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewFinancials={handleViewFinancials}
          />
        ))}
      </div>

      {selectedProperty && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">
            Financial Overview - {selectedProperty.name}
          </h2>
          <PropertyFinancials
            propertyId={selectedProperty.id}
            rentRoll={selectedProperty.financials.rentRoll}
            expenses={selectedProperty.financials.expenses}
            maintenance={selectedProperty.financials.maintenance}
          />
        </div>
      )}
    </div>
  );
};

export default Properties;