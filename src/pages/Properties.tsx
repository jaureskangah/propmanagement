import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";

// Mock data - replace with real data when backend is integrated
const initialProperties = [
  {
    id: "1",
    name: "Maple Heights",
    address: "123 Maple Street, Toronto, ON",
    units: 4,
    type: "Apartment Building",
  },
  {
    id: "2",
    name: "Pine Valley Homes",
    address: "456 Pine Road, Vancouver, BC",
    units: 2,
    type: "Duplex",
  },
];

const Properties = () => {
  const [properties, setProperties] = useState(initialProperties);
  console.log("Rendering Properties page with", properties.length, "properties");

  const handleEdit = (id: string) => {
    console.log("Edit property:", id);
    // Implement edit functionality
  };

  const handleDelete = (id: string) => {
    console.log("Delete property:", id);
    setProperties(properties.filter(property => property.id !== id));
  };

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
          />
        ))}
      </div>
    </div>
  );
};

export default Properties;