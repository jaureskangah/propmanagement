
import { Activity, GroupedActivities } from "../activityTypes";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Helper to format activity type for display
const formatActivityType = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// Helper to extract text content from JSX element
const getTextFromComponent = (component: JSX.Element): string => {
  // Simple extraction - this is a basic implementation
  // In a real app, we might want to use a more robust solution
  return component.props.children || "Activity details";
};

// Convert activities to CSV format
export const activitiesToCSV = (activities: Activity[]): string => {
  // CSV Header
  let csvContent = "Date,Type,Details\n";
  
  // Add each activity as a row
  activities.forEach(activity => {
    const date = format(new Date(activity.created_at), "yyyy-MM-dd HH:mm");
    const type = formatActivityType(activity.type);
    const details = getTextFromComponent(activity.component);
    
    // Escape quotes in the details to avoid breaking CSV format
    const escapedDetails = details.replace(/"/g, '""');
    
    csvContent += `${date},"${type}","${escapedDetails}"\n`;
  });
  
  return csvContent;
};

// Export activities as CSV file
export const exportActivitiesAsCSV = (activities: Activity[], fileName = "activities.csv"): void => {
  const csvContent = activitiesToCSV(activities);
  
  // Create a Blob with the CSV data
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
  // Create a download link and trigger the download
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export activities as PDF
export const exportActivitiesAsPDF = (
  groupedActivities: GroupedActivities, 
  fileName = "activities.pdf"
): void => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add a title
  doc.setFontSize(18);
  doc.text("Activity Report", 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated on ${format(new Date(), "PPP")}`, 14, 30);
  
  // For each group of activities
  let yPos = 40;
  Object.entries(groupedActivities).forEach(([dateGroup, activities]) => {
    // Add the date group as a section header
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    yPos += 10;
    doc.text(dateGroup, 14, yPos);
    yPos += 5;
    
    // Prepare the data for the table
    const tableData = activities.map(activity => [
      format(new Date(activity.created_at), "PPp"),
      formatActivityType(activity.type),
      getTextFromComponent(activity.component)
    ]);
    
    // Add the table
    autoTable(doc, {
      startY: yPos,
      head: [["Time", "Type", "Details"]],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202] },
      margin: { top: 10 },
    });
    
    // Update the Y position for the next section
    yPos = (doc as any).lastAutoTable.finalY + 10;
  });
  
  // Save the PDF with the given file name
  doc.save(fileName);
};

// Hook to provide export functionality
export const useActivityExport = (groupedActivities: GroupedActivities) => {
  // Get all activities flattened
  const allActivities = Object.values(groupedActivities).flat();
  
  const exportToCSV = () => {
    exportActivitiesAsCSV(allActivities);
  };
  
  const exportToPDF = () => {
    exportActivitiesAsPDF(groupedActivities);
  };
  
  return {
    exportToCSV,
    exportToPDF
  };
};
