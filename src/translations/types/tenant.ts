
export interface TenantTranslations {
  // Liste des locataires
  tenantsList: string;
  tenantsSubtitle: string;
  addTenant: string;
  editTenant: string;
  deleteTenant: string;
  searchTenants: string;
  noTenants: string;
  noTenantsFiltered: string;
  leaseStatus: string;
  filterByStatus: string;
  allStatuses: string;
  active: string;
  expiring: string;
  expired: string;

  // Formulaire locataire
  personalInfo: string;
  propertyInfo: string;
  leaseInfo: string;
  name: string;
  email: string;
  phone: string;
  selectProperty: string;
  unitNumber: string;
  leaseStart: string;
  leaseEnd: string;
  rentAmount: string;
  saveTenant: string;
  cancel: string;

  // Documents
  documents: string;
  uploadDocument: string;
  uploading: string;
  documentDeleted: string;
  confirmDeleteDocument: string;
  documentDeleteWarning: string;
  noDocuments: string;
  generateDocument: string;
  downloadDocument: string;
  openDocument: string;

  // Communication
  communications: string;
  newMessage: string;
  inviteTenant: string;
  subject: string;
  content: string;
  send: string;
  sending: string;
  messageType: string;
  messageCategory: string;
  general: string;
  urgent: string;
  maintenance: string;
  noCommunications: string;

  // Paiements
  payments: string;
  addPayment: string;
  editPayment: string;
  deletePayment: string;
  paymentDate: string;
  amount: string;
  paymentStatus: string;
  noPayments: string;
  pending: string;
  completed: string;
  failed: string;
  paid: string;
  overdue: string;
  confirmDeletePayment: string;
  paymentDeleteWarning: string;
  paymentDeleted: string;
  paymentAdded: string;
  paymentUpdated: string;
  paymentError: string;
  selectPaymentStatus: string;

  // Profile
  noTenantSelected: string;
  selectTenantToView: string;
  notLinkedToTenant: string;
  contactManager: string;
  linkAccountRequired: string;
  profileSection: string;
  emailLabel: string;
  phoneLabel: string;
  unitLabel: string;
  rentAmountLabel: string;
  leaseStartLabel: string;
  leaseEndLabel: string;
  notAvailable: string;
  perMonth: string;

  // Messages de confirmation/succès
  tenantAdded: string;
  tenantUpdated: string;
  tenantDeleted: string;
  confirmDelete: string;
  deleteWarning: string;
  invitationSent: string;
  messageSent: string;
}
