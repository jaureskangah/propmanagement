
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { VendorAppointmentCalendar } from "./VendorAppointmentCalendar";
import { Vendor } from "@/types/vendor";

interface VendorAppointmentsTabProps {
  vendors: Vendor[];
}

export const VendorAppointmentsTab = ({ vendors }: VendorAppointmentsTabProps) => {
  return (
    <TabsContent value="appointments" className="space-y-4">
      <VendorAppointmentCalendar vendors={vendors} />
    </TabsContent>
  );
};
