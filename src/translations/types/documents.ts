
export interface DocumentGeneratorTranslations {
  documentGenerator: string;
  documentTemplates: string;
  editContent: string;
  preview: string;
  documentType: string;
  generatePreview: string;
  downloadDocument: string;
  saveDocument: string;
  generating: string;
  downloading: string;
  saving: string;
  noPreviewAvailable: string;
  generatePreviewDescription: string;
  startTypingDocument: string;
  downloadStarted: string;
  downloadStartedDescription: string;
  documentSaved: string;
  documentSavedDescription: string;
  generatingPreview: string;
  templateLoaded: string;
  templateLoadedDescription: string;
  description: string;
  
  // Document history related translations
  documentHistory: string;
  noDocumentHistory: string;
  viewDocumentHistory: string;
  documentHistoryDescription: string;
  dateGenerated: string;
  documentName: string;
  documentCategory: string;
  documentActions: string;
  
  // Document categories
  leaseDocuments: string;
  paymentDocuments: string;
  noticeDocuments: string;
  inspectionDocuments: string;
  miscDocuments: string;
  
  // Document templates
  leaseAgreement: string;
  leaseRenewal: string;
  leaseTermination: string;
  rentReceipt: string;
  paymentReminder: string;
  latePaymentNotice: string;
  noticeToVacate: string;
  entryNotice: string;
  maintenanceNotice: string;
  moveInChecklist: string;
  moveOutChecklist: string;
  inspectionReport: string;
  tenantComplaint: string;
  propertyRules: string;
  customDocument: string;
  
  // Signature related
  addSignature: string;
  clear: string;
  saveSignature: string;
  signDocument: string;
  documentSigned: string;
  
  // Dummy content for templates
  leaseAgreementContent?: string;
  leaseRenewalContent?: string;
  leaseTerminationContent?: string;
  rentReceiptContent?: string;
  paymentReminderContent?: string;
  latePaymentNoticeContent?: string;
  noticeToVacateContent?: string;
  entryNoticeContent?: string;
  maintenanceNoticeContent?: string;
  moveInChecklistContent?: string;
  moveOutChecklistContent?: string;
  inspectionReportContent?: string;
  tenantComplaintContent?: string;
  propertyRulesContent?: string;
  customDocumentContent?: string;
}
